import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1/transactions';

  // --- Deposit ---
  deposit(amount: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, {
      amount,
      description,
    });
  }

  // --- Withdraw ---
  withdraw(amount: number, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, {
      amount,
      description,
    });
  }

  // --- Transfer ---
  transfer(
    amount: number,
    receiverWban: string,
    description: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, {
      amount,
      receiverWban,
      description,
    });
  }

  // --- Cross Bank Transfer ---
  crossBankTransfer(
    amount: number,
    targetBankName: string,
    description: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/cross-bank-transfer`, {
      amount,
      targetBankName,
      description,
    });
  }

  // --- Transaction History ---
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }
}