import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.API_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<any>(`${environment.API_URL}/auth/register`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response?.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
  }

  getAllUsers() {
    return this.http.get<any>(`${environment.API_URL}/users`).pipe(
      tap((response) => {
        return response;
      })
    );
  }
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(`${environment.API_URL}/${userId}`).pipe(
      tap((response) => {
        return response;
      })
    );
  }
}
