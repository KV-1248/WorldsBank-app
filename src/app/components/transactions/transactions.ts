import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions implements OnInit {
  private txService = inject(TransactionService);

  activeTab = 'history';
  amount = 0;
  description = '';
  receiverWban = '';
  targetBankName = '';
  message = '';
  isError = false;
  loading = false;

  transactions = signal<any[]>([]);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.txService.getHistory().subscribe({
      next: (txs) => this.transactions.set(txs)
    });
  }

  deposit() {
    this.loading = true;
    this.txService.deposit(this.amount, this.description).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Deposit successful!';
        this.isError = false;
        this.reset();
        this.loadHistory();
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Deposit failed.';
        this.isError = true;
      }
    });
  }

  withdraw() {
    this.loading = true;
    this.txService.withdraw(this.amount, this.description).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Withdrawal successful!';
        this.isError = false;
        this.reset();
        this.loadHistory();
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Withdrawal failed.';
        this.isError = true;
      }
    });
  }

  transfer() {
    this.loading = true;
    this.txService.transfer(this.amount, this.receiverWban, this.description).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Transfer successful!';
        this.isError = false;
        this.reset();
        this.loadHistory();
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Transfer failed.';
        this.isError = true;
      }
    });
  }

  crossBank() {
    this.loading = true;
    this.txService.crossBankTransfer(this.amount, this.targetBankName, this.description).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Cross bank transfer successful!';
        this.isError = false;
        this.reset();
        this.loadHistory();
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Transfer failed.';
        this.isError = true;
      }
    });
  }

  reset() {
    this.amount = 0;
    this.description = '';
    this.receiverWban = '';
    this.targetBankName = '';
  }
}