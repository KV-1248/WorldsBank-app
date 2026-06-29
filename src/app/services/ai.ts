import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://worldsbank.cfd/api/v1/ai';

  // --- Ask AI Assistant ---
  ask(question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/assistant`, { question });
  }
}