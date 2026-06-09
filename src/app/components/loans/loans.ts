import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { LoanService } from '../../services/loan';

@Component({
  selector: 'app-loans',
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './loans.html',
  styleUrl: './loans.scss'
})
export class Loans implements OnInit {
  private loanService = inject(LoanService);

  loans = signal<any[]>([]);
  loading = signal(true);
  selectedLoan = signal<any>(null);

  ngOnInit() {
    this.loanService.getMyLoans().subscribe({
      next: (data) => {
        this.loans.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  viewLoan(loan: any) {
    this.selectedLoan.set(loan);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'rejected';
      case 'DISBURSED': return 'disbursed';
      case 'REPAID': return 'repaid';
      default: return 'pending';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'APPROVED': return '✅';
      case 'PENDING': return '⏳';
      case 'REJECTED': return '❌';
      case 'DISBURSED': return '💰';
      case 'REPAID': return '🏆';
      default: return '⏳';
    }
  }

  // Calculate months remaining based on applied date + duration
  getMonthsRemaining(loan: any): number {
    if (loan.status === 'REPAID') return 0;
    const applied = new Date(loan.appliedAt);
    const endDate = new Date(applied);
    endDate.setMonth(endDate.getMonth() + loan.durationMonths);
    const now = new Date();
    const diff = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.max(0, diff);
  }

  // Calculate amount paid so far
  getAmountPaid(loan: any): number {
    if (loan.status === 'PENDING' || loan.status === 'REJECTED') return 0;
    const applied = new Date(loan.appliedAt);
    const now = new Date();
    const monthsPassed = Math.floor(
      (now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const paid = Math.min(monthsPassed, loan.durationMonths) * loan.monthlyRepayment;
    return Math.min(paid, loan.totalRepayment);
  }

  // Balance remaining
  getBalanceRemaining(loan: any): number {
    return loan.totalRepayment - this.getAmountPaid(loan);
  }

  // Progress percentage
  getProgress(loan: any): number {
    if (loan.status === 'REPAID') return 100;
    if (loan.status === 'PENDING' || loan.status === 'REJECTED') return 0;
    return Math.min(100, Math.round(
      (this.getAmountPaid(loan) / loan.totalRepayment) * 100
    ));
  }
}