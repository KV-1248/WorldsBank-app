import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private router = inject(Router);

  //---signals---
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<string | null>(null);

  //---Read only exposed signals---
  isLoggedIn = this._isLoggedIn.asReadonly();
  currentUser = this._currentUser.asReadonly();

  //---computed signals---
  greetings = computed(() => {
    const user = this._currentUser();
    return user ? `Welcome back, ${user}!` : 'Welcome, Guest!';
  });

  //---Hardcoded test case users ---
  private users = [
    { email: 'user@worldsbank.com', password: 'Kamau123', name: 'Kamau Njuguna' },
    { email: 'test@worldsbank.com', password: 'Kamau123', name: 'Test User' },
  ];
  // ---Login method---
  login(email: string, password: string): boolean {
    const matchingUser = this.users.find((U) => U.email === email && U.password === password);

    if (matchingUser) {
      this._isLoggedIn.set(true);
      this._currentUser.set(matchingUser.name);
      localStorage.setItem('wb_token', 'dummy-jwt-token');
      localStorage.setItem('wb_user', matchingUser.name);
      return true;
    }
    return false;
  }

  //---Logout method---
  logout(): void {
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    localStorage.removeItem('wb_token');
    localStorage.removeItem('wb_user');
    this.router.navigate(['/login']);
  }

  // method called on app startup to restore session
  checkSession(): void {
    const token = localStorage.getItem('wb_token');
    const user = localStorage.getItem('wb_user');

    if (token && user) {
      this._isLoggedIn.set(true);
      this._currentUser.set(user);
    }
  }
}
