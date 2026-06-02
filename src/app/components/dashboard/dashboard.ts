import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account';
import { TransactionService } from '../../services/transaction';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private auth = inject(Auth);

  account = signal<any>(null);
  linkedBanks = signal<any[]>([]);
  recentTransactions = signal<any[]>([]);
  conversion = signal<any>(null);
  loading = signal(true);

  userName = this.auth.currentUser;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.accountService.getMyAccount().subscribe({
      next: (acc) => {
        this.account.set(acc);
        this.loading.set(false);
        this.loadConversion(acc.baseCurrency);
      },
      error: () => this.loading.set(false)
    });

    this.accountService.getLinkedBanks().subscribe({
      next: (banks) => this.linkedBanks.set(banks)
    });

    this.transactionService.getHistory().subscribe({
      next: (txs) => this.recentTransactions.set(txs.slice(0, 5))
    });
  }

  loadConversion(baseCurrency: string) {
    // Default to USD conversion based on location
    this.accountService.getRegionalConversion('USD', 'USA').subscribe({
      next: (conv) => this.conversion.set(conv),
      error: () => {}
    });
  }
}