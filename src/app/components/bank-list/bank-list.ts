import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account';
import { Banks } from '../../services/bank';
import { Bank } from '../../interfaces/bank';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.scss'
})
export class BankList implements OnInit {
  private accountService = inject(AccountService);
  private banksService = inject(Banks);

  banks = this.banksService.banks;
  linkedBanks = signal<any[]>([]);
  showForm = signal(false);
  formBank = signal<Bank | null>(null);
  message = signal('');
  isError = signal(false);
  loading = signal(false);
  successToast = signal('');

  selectedAccountType = '';
  selectedCurrency = 'KES';

  // User details from localStorage
  userName = localStorage.getItem('wb_user') || '';
  userEmail = localStorage.getItem('wb_email') || '';
  userWban = '';

  ngOnInit() {
    this.accountService.getLinkedBanks().subscribe({
      next: (banks) => this.linkedBanks.set(banks)
    });

    this.accountService.getMyAccount().subscribe({
      next: (acc) => this.userWban = acc.wban
    });
  }

  openWebsite(bank: Bank) {
    window.open(bank.website, '_blank');
  }

  openForm(bank: Bank) {
    if (this.isLinked(bank.name)) return;
    this.formBank.set(bank);
    this.selectedAccountType = bank.accountTypes[0]?.name || '';
    this.selectedCurrency = 'KES';
    this.message.set('');
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.formBank.set(null);
    this.message.set('');
  }

  isLinked(bankName: string): boolean {
    return this.linkedBanks().some(b =>
      b.bankName.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(b.bankName.toLowerCase())
    );
  }

  submitForm() {
    const bank = this.formBank();
    if (!bank) return;

    this.loading.set(true);
    this.message.set('');

    this.accountService.linkBankAccount({
      bankName: bank.name,
      country: bank.headquarters,
      currency: this.selectedCurrency
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.closeForm();
        this.successToast.set(
          `${bank.name} account opened successfully! Your account number is ${this.userWban}`
        );
        this.accountService.getLinkedBanks().subscribe({
          next: (banks) => this.linkedBanks.set(banks)
        });
        setTimeout(() => this.successToast.set(''), 5000);
      },
      error: (err) => {
        this.loading.set(false);
        this.message.set(err.error?.message || 'Failed to open account. Try again.');
        this.isError.set(true);
      }
    });
  }
}