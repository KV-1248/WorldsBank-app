import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1/transactions';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('wb_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  deposit(amount: number, description: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/deposit`, { amount, description });
}

withdraw(amount: number, description: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/withdraw`, { amount, description });
}

transfer(amount: number, receiverWban: string, description: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/transfer`, { amount, receiverWban, description });
}

crossBankTransfer(amount: number, targetBankName: string, description: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/cross-bank-transfer`, { amount, targetBankName, description });
}

getHistory(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/history`);
}
}