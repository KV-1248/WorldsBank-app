export interface Bank {
  id: number;
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  colour: string;
  headquarters: string;
  founded: number;
  minDeposit: number;
  interestRate: number;
  features: string[];
  rating: number;
  accountTypes: AccountType[];
  loanLimit: LoanLimit;
  website: string;
  ceo: string;
}
export interface AccountType {
  name: string;
  minBalance: number;
  description: string;
}
export interface LoanLimit {
  personal: number; // Maximum personal loan in KES
  business: number; // Maximum business loan in KES
  mortgage: number; // Maximum mortgage loan in KES
  interestRates: number; // Average interest rate %
}
export interface KycData {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  crbPin: string;
  employmentStatus: string;
  monthlyIncome: number;
  bankId: number;
  accountType: string;
}
export interface CrbResults {
  score: number;
  status: 'approved' | 'rejected' | 'pending';
  reason: string;
}
