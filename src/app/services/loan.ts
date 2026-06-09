import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1/loans';

  getMyLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-loans`);
  }

  checkEligibility(): Observable<any> {
    return this.http.get(`${this.baseUrl}/eligibility`);
  }

  applyLoan(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply`, data);
  }
}