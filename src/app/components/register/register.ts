import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  nationalId = '';
  dateOfBirth = '';
  nationality = '';
  address = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  private auth = inject(Auth);
  private router = inject(Router);

  register() {
    if (!this.firstName || !this.lastName || !this.email ||
        !this.phoneNumber || !this.nationalId || !this.dateOfBirth ||
        !this.nationality || !this.address || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      nationalId: this.nationalId,
      dateOfBirth: this.dateOfBirth,
      nationality: this.nationality,
      address: this.address,
      password: this.password
    };

    this.auth.register(data).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created! Check your email for OTP.';
        setTimeout(() => {
          this.router.navigate(['/verify-otp'],
            { queryParams: { email: this.email } });
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(err);
      }
    });
  }

  private getErrorMessage(err: any): string {
    if (err.name === 'TimeoutError') {
      return 'Registration is taking too long. Check the backend logs for the register request, email/OTP sending, and database connection.';
    }

    if (typeof err.error === 'string' && err.error.trim()) {
      return err.error;
    }

    return err.error?.message || 'Registration failed. Try again.';
  }
}
