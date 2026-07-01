import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-login-otp',
  imports: [FormsModule, CommonModule],
  templateUrl: './verify-login-otp.html',
  styleUrl: './verify-login-otp.scss'
})
export class VerifyLoginOtp {
  otp = '';
  errorMessage = '';
  loading = false;
  resending = false;

  private auth = inject(Auth);
  private router = inject(Router);

  verify() {
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    const email = this.auth.pendingEmail() || '';

    this.auth.verifyLoginOtp(email, this.otp).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP. Try again.';
      }
    });
  }

  resend() {
    this.resending = true;
    const email = this.auth.pendingEmail() || '';
    this.auth.resendOtp(email, 'LOGIN').subscribe({
      next: () => {
        this.resending = false;
      },
      error: () => {
        this.resending = false;
      }
    });
  }
}