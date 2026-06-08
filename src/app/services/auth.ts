import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private requestTimeoutMs = 30000;

  // --- signals ---
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<string | null>(null);
  private _pendingEmail = signal<string | null>(null);

  // --- readonly signals ---
  isLoggedIn = this._isLoggedIn.asReadonly();
  currentUser = this._currentUser.asReadonly();
  pendingEmail = this._pendingEmail.asReadonly();

  // --- computed ---
  greetings = computed(() => {
    const user = this._currentUser();
    return user ? `Welcome back, ${user}!` : 'Welcome, Guest!';
  });

  // --- Register ---
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, {
      responseType: 'text'
    }).pipe(timeout(this.requestTimeoutMs));
  }

  // --- Verify Account Activation OTP ---
  verifyOtp(email: string, otp: string): Observable<any> {
    this._pendingEmail.set(email);
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp }, {
      responseType: 'text'
    }).pipe(timeout(this.requestTimeoutMs));
  }

  // --- Login Step 1 — send credentials, get OTP ---
  login(email: string, password: string): Observable<any> {
    this._pendingEmail.set(email);
    return this.http.post(`${this.baseUrl}/login`, { email, password }, {
      responseType: 'text'
    }).pipe(timeout(this.requestTimeoutMs));
  }

  // --- Login Step 2 — verify login OTP, get JWT ---
  verifyLoginOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-login-otp`, { email, otp }).pipe(
      timeout(this.requestTimeoutMs),
      tap((response: any) => {
        localStorage.setItem('wb_token', response.token);
        localStorage.setItem('wb_user', response.firstName + ' ' + response.lastName);
        localStorage.setItem('wb_email', response.email);
        this._isLoggedIn.set(true);
        this._currentUser.set(response.firstName + ' ' + response.lastName);
      })
    );
  }

  // --- Resend OTP ---
  resendOtp(email: string, otpType: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/resend-otp?email=${email}&otpType=${otpType}`,
      {},
      { responseType: 'text' }
    ).pipe(timeout(this.requestTimeoutMs));
  }

  // --- Logout ---
  logout(): void {
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    this._pendingEmail.set(null);
    localStorage.removeItem('wb_token');
    localStorage.removeItem('wb_user');
    localStorage.removeItem('wb_email');
    this.router.navigate(['/login']);
  }

  // --- Restore session on app startup ---
  checkSession(): void {
    const token = localStorage.getItem('wb_token');
    const user = localStorage.getItem('wb_user');
    if (token && user) {
      this._isLoggedIn.set(true);
      this._currentUser.set(user);
    }
  }

  // --- Get token for HTTP calls ---
  getToken(): string | null {
    return localStorage.getItem('wb_token');
  }
}
