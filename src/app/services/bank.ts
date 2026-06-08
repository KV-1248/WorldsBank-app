import { Injectable, signal, computed, inject } from '@angular/core';
import { Bank } from '../interfaces/bank';

@Injectable({
  providedIn: 'root',
})
export class Banks {
  //---signals---
  private _searchQuery = signal<string>('');
  private _selectedBankId = signal<number | null>(null);

  //---Read only exposed signals---
  searchQuery = this._searchQuery.asReadonly();

  //---computed ---
  filteredBanks = computed(() => {
    const query = this._searchQuery().toLowerCase();
    return this.banks.filter(
      (b) => b.name.toLowerCase().includes(query) || b.shortName.toLowerCase().includes(query),
    );
  });

  selectedBank = computed(() => this.banks.find((b) => b.id === this._selectedBankId()) ?? null);
  //---methods---
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }
  selectBank(id: number): void {
    this._selectedBankId.set(id);
  }
  getBankById(id: number): Bank | undefined {
    return this.banks.find((b) => b.id === id);
  }

  //---hardcoded bank data---
  readonly banks: Bank[] = [
    {
      id: 1,
      name: 'Kenya Commercial Bank',
      shortName: 'KCB',
      tagline: 'Beyond Banking',
      logo: '/assets/banks/KCB_Bank_Kenya_Limited_logo.png',
      colour: '#006B3C',
      headquarters: 'Nairobi, Kenya',
      founded: 1896,
      ceo: 'Joshua Oigara',
      website: 'https://www.kcbgroup.com/',
      minDeposit: 500,
      interestRate: 7.5,
      rating: 4.5,
      features: [
        'Mobile Banking',
        'Zero minimum balance',
        'Free M-PESA transfers',
        'KCB M-Pesa instant loans',
        '24/7 digital banking',
        '200+ branches nationwide',
      ],
      accountTypes: [
        {
          name: 'Saving Account',
          minBalance: 0,
          description: 'Earn interest with zero minimum balance.',
        },
        {
          name: 'Current Account',
          minBalance: 5000,
          description: 'For businesses and professionals.',
        },
        {
          name: 'Junior Account',
          minBalance: 0,
          description: 'For children under 18.',
        },
      ],
      loanLimit: {
        personal: 3000000,
        business: 10000000,
        mortgage: 50000000,
        interestRates: 13.5,
      },
    },
    {
      id: 2,
      name: 'Stanbic Bank Kenya',
      shortName: 'STANBIC',
      tagline: 'Moving Forward',
      logo: '/assets/banks/New-Stanbic-Bank-Logo.jpg',
      colour: '#0033A0',
      headquarters: 'Nairobi, Kenya',
      founded: 1992,
      minDeposit: 2000,
      interestRate: 8.2,
      rating: 4.6,
      website: 'https://www.stanbicbank.co.ke/',
      ceo: 'Dr. Joshua Oigara',
      features: [
        'Standard Bank Group backing',
        'Pan-African network access',
        'Trade finance solutions',
        'Premium relationship banking',
        'Online investment platform',
      ],
      accountTypes: [
        {
          name: 'Savings Account',
          minBalance: 2000,
          description: 'Competitive interest for individual savers.',
        },
        {
          name: 'Business Account',
          minBalance: 10000,
          description: 'Tailored for SMEs and corporates.',
        },
        {
          name: 'Premium Account',
          minBalance: 50000,
          description: 'Exclusive benefits for high net worth clients.',
        },
      ],
      loanLimit: {
        personal: 5000000,
        business: 20000000,
        mortgage: 80000000,
        interestRates: 12.9,
      },
    },
    {
      id: 3,
      name: 'Equity Bank Kenya',
      shortName: 'EQUITY',
      tagline: 'Growing. Transforming. Lives.',
      logo: '/assets/banks/Equity_Bank_Logo.png',
      colour: '#E30613',
      headquarters: 'Nairobi, Kenya',
      founded: 1984,
      minDeposit: 0,
      interestRate: 7.0,
      rating: 4.3,
      website: 'https://equitygroupholdings.com/ke/',
      ceo: 'Dr. James Mwangi',
      features: [
        'Largest customer base in Kenya',
        'Equity Mobile App',
        'Equitel SIM banking',
        'Agency banking countrywide',
        'Affordable credit products',
      ],
      accountTypes: [
        {
          name: 'Bora Account',
          minBalance: 0,
          description: 'Basic account for everyone, zero fees.',
        },
        {
          name: 'Eazzy Account',
          minBalance: 1000,
          description: 'Digital first account with Eazzy app.',
        },
        {
          name: 'Business Account',
          minBalance: 5000,
          description: 'For registered businesses and enterprises.',
        },
      ],
      loanLimit: {
        personal: 2000000,
        business: 8000000,
        mortgage: 40000000,
        interestRates: 14.0,
      },
    },
    {
      id: 4,
      name: 'ABSA Bank Kenya',
      shortName: 'ABSA',
      tagline: 'Your Story Matters',
      logo: '/assets/banks/images.jpeg',
      colour: '#DC0037',
      headquarters: 'Nairobi, Kenya',
      founded: 1916,
      minDeposit: 1000,
      interestRate: 8.0,
      rating: 4.2,
      website: 'https://www.absa.co.ke/',
      ceo: 'Abdi Mohamed',
      features: [
        'Barclays legacy network',
        'ABSA diaspora banking',
        'Timiza mobile loans',
        'Pan-African presence',
        'Robust forex services',
      ],
      accountTypes: [
        {
          name: 'Transact Account',
          minBalance: 1000,
          description: 'Everyday banking made simple.',
        },
        {
          name: 'Flexi Save',
          minBalance: 500,
          description: 'Flexible savings with good returns.',
        },
        {
          name: 'Business Evolve',
          minBalance: 10000,
          description: 'For growing businesses.',
        },
      ],
      loanLimit: {
        personal: 4000000,
        business: 15000000,
        mortgage: 60000000,
        interestRates: 13.0,
      },
    },
    {
      id: 5,
      name: 'American Express',
      shortName: 'AMEX',
      tagline: "Don't Live Life Without It",
      logo: '/assets/banks/American_Express_logo_(2018).svg',
      colour: '#000000',
      headquarters: 'New York, USA',
      founded: 1958,
      minDeposit: 10000,
      interestRate: 12.5,
      rating: 4.5,
      website: 'https://www.americanexpress.com/',
      ceo: 'Mr Squeri Stephen J.',
      features: [
        'Premium credit cards',
        'Exclusive offers and discounts',
        'Priority customer service',
      ],
      accountTypes: [
        {
          name: 'Gold Card',
          minBalance: 10000,
          description: 'For high-spending individuals.',
        },
      ],
      loanLimit: {
        personal: 3000000,
        business: 10000000,
        mortgage: 50000000,
        interestRates: 12.5,
      },
    },
  ];
}
