import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./components/verify-otp/verify-otp').then((m) => m.VerifyOtp),
  },
  {
    path: 'verify-login-otp',
    loadComponent: () =>
      import('./components/verify-login-otp/verify-login-otp').then(
        (m) => m.VerifyLoginOtp
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions').then(
            (m) => m.Transactions
          ),
      },
      {
        path: 'banks',
        loadComponent: () =>
          import('./components/bank-list/bank-list').then((m) => m.BankList),
      },
      {
        path: 'bank/:id',
        loadComponent: () =>
          import('./components/bank-details/bank-details').then(
            (m) => m.BankDetails
          ),
      },
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./components/ai-assistant/ai-assistant').then(
            (m) => m.AiAssistant
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];