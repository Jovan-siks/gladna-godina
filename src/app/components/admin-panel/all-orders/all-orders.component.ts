import {
  Component,
  ElementRef,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../services/food.service';
import html2pdf from 'html2pdf.js';

interface User {
  _id: string;
  name: string;
  role?: string;
}

interface WeeklyOrder {
  weekStartDate: string;
  orders: Array<{
    userId: string;
    entries: Array<{ foodName: string; price: number }>;
  }>;
}

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="p-4 mt-34 max-w-3xl mx-auto border border-[var(--border)] rounded-md bg-[var(--card)] shadow-lg"
    >
      <h2 class="text-xl font-semibold mb-4 text-[var(--foreground)]">
        Mjesečni Rezime
      </h2>
      <table
        class="min-w-full text-sm text-[var(--foreground)] border border-[var(--border)]"
      >
        <thead
          class="text-xs text-[var(--muted-foreground)] uppercase tracking-wider  bg-[var(--card)]/50"
        >
          <tr>
            <th class="px-6 py-4 text-left border border-[var(--border)]">
              Zaposleni
            </th>
            <th class="px-6 py-4 text-left border border-[var(--border)]">
              Obroka
            </th>
            <th class="px-6 py-4 text-left border border-[var(--border)]">
              Ukupno (€)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let rec of summary(); trackBy: trackByName"
            class="hover:bg-[var(--muted)]/30 transition-all"
          >
            <td class="px-6 py-3 border border-[var(--border)] font-medium">
              {{ rec.name }}
            </td>
            <td class="px-6 py-3 border border-[var(--border)] text-center">
              {{ rec.mealsCount }}
            </td>
            <td class="px-6 py-3 border border-[var(--border)] text-right">
              {{ rec.totalCost.toFixed(2) }} €
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center max-w-3xl mx-auto mt-4">
        <button
          class="px-4 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80  cursor-pointer  transition"
          (click)="exportAsPDF()"
        >
          Export as PDF
        </button>
      </div>
      <div id="pdf-export" style="display: none">
        <h2 style="font-size: 20px; margin-bottom: 16px;">Mjesečni Rezime</h2>
        <table
          border="1"
          cellpadding="8"
          cellspacing="0"
          style="width: 100%; border-collapse: collapse;"
        >
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th align="left">Zaposleni</th>
              <th align="center">Obroka</th>
              <th align="right">Ukupno (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rec of summary()">
              <td>{{ rec.name }}</td>
              <td align="center">{{ rec.mealsCount }}</td>
              <td align="right">{{ rec.totalCost.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AllOrdersComponent implements OnInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  users = signal<User[]>([]);
  summary = signal<
    Array<{
      name: string;
      mealsCount: number;
      totalCost: number;
    }>
  >([]);
  yearMonth = new Date().toISOString().slice(0, 7); // Format YYYY-MM
  trackByName(index: number, item: { name: string }) {
    return item.name;
  }

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    // this.loadData();
    this.fetchMonthlySummary();
  }
  fetchMonthlySummary() {
    this.foodService.getMonthlySummary(this.yearMonth).subscribe({
      next: (data) => {
        const mapped = data.map((item: any) => ({
          name: item.name,
          mealsCount: item.totalMeals ?? 0,
          totalCost: item.totalPrice ?? 0,
        }));
        this.summary.set(mapped);
      },
      error: (err) => {
        console.error('Failed to fetch summary', err);
      },
    });
  }
  exportAsPDF() {
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">Mjesečni Rezime</h2>
        <p style="text-align: left; margin-bottom: 20px;"><strong>Mjesec:</strong> ${
          this.yearMonth
        }</p>
        <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background-color: #f0f0f0; padding: 8px;">
            <tr>
              <th align="left">Zaposleni</th>
              <th align="center">Obroka</th>
              <th align="right">Ukupno (€)</th>
            </tr>
          </thead>
          <tbody>
            ${this.summary()
              .map(
                (s) => `
              <tr>
                <td>${s.name}</td>
                <td align="center">${s.mealsCount}</td>
                <td align="right">${s.totalCost.toFixed(2)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    import('html2pdf.js').then((html2pdfLib) => {
      html2pdfLib
        .default()
        .set({
          margin: 0.5,
          filename: `monthly-summary-${this.yearMonth}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(tempDiv)
        .save();
    });
  }
}
