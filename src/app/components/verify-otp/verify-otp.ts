import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule, CommonModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.scss'
})
export class VerifyOtp implements OnInit {
  otp = '';
  email = '';
  errorMessage = '';
  successMessage = '';
  loading = false;
  resending = false;

  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || this.auth.pendingEmail() || '';
    });
  }

  verify() {
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account verified! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP. Try again.';
      }
    });
  }

  resend() {
    this.resending = true;
    this.auth.resendOtp(this.email, 'ACCOUNT_ACTIVATION').subscribe({
      next: () => {
        this.resending = false;
        this.successMessage = 'New OTP sent to your email.';
      },
      error: () => {
        this.resending = false;
        this.errorMessage = 'Failed to resend OTP.';
      }
    });
  }
}