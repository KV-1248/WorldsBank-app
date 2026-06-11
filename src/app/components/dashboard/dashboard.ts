import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account';
import { TransactionService } from '../../services/transaction';
import { Auth } from '../../services/auth';
import { LocationService } from '../../services/location';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, DecimalPipe, DatePipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private auth = inject(Auth);
  private locationService = inject(LocationService);
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/api/v1';

  // ── Core ─────────────────────────────────────────────
  account = signal<any>(null);
  linkedBanks = signal<any[]>([]);
  recentTransactions = signal<any[]>([]);
  loading = signal(true);
  userWban = signal<string>('');
  userName = this.auth.currentUser;

  // ── Location-aware conversion ─────────────────────────
  locationConversion = signal<any>(null);
  locationConversionLoading = signal(false);

  // Expose location signals
  detectedCountry = this.locationService.detectedCountry;
  detectedCurrency = this.locationService.detectedCurrency;
  locationReady = this.locationService.locationReady;

  // ── Dashboard tab ─────────────────────────────────────
  dashTab = 'overview';

  // ── Currency converter ────────────────────────────────
  convertAmount = 0;
  convertCurrency = 'USD';
  convertCountry = 'USA';
  convertLoading = false;
  convertError = '';
  conversionResult = signal<any>(null);

  customConvertedAmount = computed(() => {
    const rate = this.conversionResult()?.conversionRate || 0;
    return this.convertAmount * rate;
  });

  customFeeAmount = computed(() => this.customConvertedAmount() * 0.025);
  customAmountAfterFee = computed(() => this.customConvertedAmount() - this.customFeeAmount());

  // ── Loan ─────────────────────────────────────────────
  loanType = 'PERSONAL';
  loanAmount = 0;
  loanDuration = 12;
  loanPurpose = '';
  loanBank = '';
  loanLoading = signal(false);
  loanMessage = signal('');
  loanIsError = signal(false);
  loanEligibility = signal<any>(null);

  constructor() {
    // React to location changes automatically
    effect(() => {
      const currency = this.locationService.detectedCurrency();
      const country = this.locationService.detectedCountry();
      const ready = this.locationService.locationReady();

      if (ready && currency && country && this.account()) {
        this.loadLocationConversion(currency, country);
      }
    });
  }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.accountService.getMyAccount().subscribe({
      next: (acc) => {
        this.account.set(acc);
        this.userWban.set(acc.wban);
        this.loading.set(false);

        // If location already detected, load conversion immediately
        if (this.locationService.locationReady()) {
          this.loadLocationConversion(
            this.locationService.detectedCurrency(),
            this.locationService.detectedCountry()
          );
        }
      },
      error: () => this.loading.set(false)
    });

    this.accountService.getLinkedBanks().subscribe({
      next: (banks) => {
        this.linkedBanks.set(banks);
        if (banks.length > 0) this.loanBank = banks[0].bankName;
      }
    });

    this.transactionService.getHistory().subscribe({
      next: (txs) => this.recentTransactions.set(txs.slice(0, 5))
    });
  }

  loadLocationConversion(currency: string, country: string) {
    if (!currency || !country) return;
    this.locationConversionLoading.set(true);

    this.accountService.getRegionalConversion(currency, country).subscribe({
      next: (conv) => {
        this.locationConversion.set(conv);
        this.locationConversionLoading.set(false);
      },
      error: () => this.locationConversionLoading.set(false)
    });
  }

  // ── Currency converter ────────────────────────────────
  convertCurrency_() {
    if (!this.convertAmount || this.convertAmount <= 0) {
      this.convertError = 'Please enter a valid amount.';
      return;
    }
    if (!this.convertCountry) {
      this.convertError = 'Please enter a country.';
      return;
    }
    this.convertLoading = true;
    this.convertError = '';
    this.conversionResult.set(null);

    this.accountService.getRegionalConversion(
      this.convertCurrency, this.convertCountry
    ).subscribe({
      next: (res) => {
        this.convertLoading = false;
        this.conversionResult.set(res);
      },
      error: (err) => {
        this.convertLoading = false;
        this.convertError = err.error?.message || 'Conversion failed.';
      }
    });
  }

  resetConversion() {
    this.conversionResult.set(null);
    this.convertError = '';
  }

  // ── Loan ─────────────────────────────────────────────
  loadLoanData() {
    this.http.get(`${this.baseUrl}/loans/eligibility`).subscribe({
      next: (res) => this.loanEligibility.set(res),
      error: () => {}
    });
  }

  applyLoan() {
    if (!this.loanAmount || this.loanAmount <= 0) {
      this.loanMessage.set('Please enter a valid loan amount.');
      this.loanIsError.set(true);
      return;
    }
    if (!this.loanPurpose) {
      this.loanMessage.set('Please enter the loan purpose.');
      this.loanIsError.set(true);
      return;
    }
    this.loanLoading.set(true);
    this.loanMessage.set('');

    this.http.post(`${this.baseUrl}/loans/apply`, {
      loanType: this.loanType,
      amount: this.loanAmount,
      durationMonths: this.loanDuration,
      purpose: this.loanPurpose,
      linkedBankName: this.loanBank
    }).subscribe({
      next: (res: any) => {
        this.loanLoading.set(false);
        this.loanIsError.set(false);
        this.loanMessage.set(
          `Loan submitted! Monthly: KES ${res.monthlyRepayment} × ${res.durationMonths} months. Total: KES ${res.totalRepayment}`
        );
      },
      error: (err) => {
        this.loanLoading.set(false);
        this.loanIsError.set(true);
        this.loanMessage.set(err.error?.message || 'Loan application failed.');
      }
    });
  }

  // ── Transaction helpers ───────────────────────────────
  isCredit(tx: any): boolean {
    if (tx.type === 'DEPOSIT') return true;
    if (tx.type === 'WITHDRAWAL') return false;
    return tx.receiverWban === this.userWban();
  }

  getTxIcon(tx: any): string {
    if (tx.type === 'DEPOSIT') return '⬆️';
    if (tx.type === 'WITHDRAWAL') return '⬇️';
    if (this.isCredit(tx)) return '📥';
    return '📤';
  }

  getTxLabel(tx: any): string {
    if (tx.type === 'DEPOSIT') return 'Deposit';
    if (tx.type === 'WITHDRAWAL') return 'Withdrawal';
    if (tx.type === 'CROSS_BANK_TRANSFER') return 'Cross Bank Transfer';
    if (tx.type === 'TRANSFER') return this.isCredit(tx) ? 'Transfer Received' : 'Transfer Sent';
    return tx.type;
  }
}