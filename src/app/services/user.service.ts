import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<any>('http://localhost:8000/api/auth/login', { email, password })
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
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<any>('http://localhost:8000/api/auth/register', {
        name,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          console.log('🚀 ~ UserService ~ tap ~ response:', response);
          if (response?.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
  }

  users() {
    return this.http
      .get<any>('http://localhost:8000/api/users')
      .pipe(tap((response) => {}));
  }
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
