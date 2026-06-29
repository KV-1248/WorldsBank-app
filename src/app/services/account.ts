import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = 'https://worldsbank.cfd/api/v1/accounts';

  // --- Get my account details ---
  getMyAccount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  // --- Link a bank account ---
  linkBankAccount(data: {
    bankName: string;
    country: string;
    currency: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/link-bank`, data);
  }

  // --- Get all linked banks ---
  getLinkedBanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/linked-banks`);
  }

  // --- Get regional currency conversion ---
  getRegionalConversion(
    targetCurrency: string,
    country: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/regional-conversion?targetCurrency=${targetCurrency}&country=${country}`
    );
  }
}