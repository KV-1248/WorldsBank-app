import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { AccountService } from '../../services/account';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  private auth = inject(Auth);
  private accountService = inject(AccountService);

  sidebarOpen = false;
  searchQuery = '';
  isDarkMode = signal(true);

  // GPS detection
  locationDetected = signal(false);
  detectedLocation = signal('');
  detectedCurrency = signal('');
  showLocationToast = signal(false);

  userName = computed(() => this.auth.currentUser() || 'User');
  userInitial = computed(() =>
    (this.auth.currentUser() || 'U').charAt(0).toUpperCase()
  );

  ngOnInit() {
    this.detectLocation();
    // Apply saved theme
    const saved = localStorage.getItem('wb_theme');
    if (saved === 'light') {
      this.isDarkMode.set(false);
      document.body.classList.add('light-mode');
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('wb_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('wb_theme', 'light');
    }
  }

  detectLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then(res => res.json())
          .then(data => {
            const country = data.address?.country || 'Unknown';
            const countryCode = data.address?.country_code?.toUpperCase() || '';
            const currency = this.getCurrencyFromCountry(countryCode);
            this.detectedLocation.set(country);
            this.detectedCurrency.set(currency);
            this.locationDetected.set(true);
            this.showLocationToast.set(true);
            // Auto hide toast after 5 seconds
            setTimeout(() => this.showLocationToast.set(false), 5000);
          })
          .catch(() => {});
      },
      () => {} // silent fail if user denies GPS
    );
  }

  getCurrencyFromCountry(code: string): string {
    const map: Record<string, string> = {
      'KE': 'KES', 'US': 'USD', 'GB': 'GBP', 'DE': 'EUR',
      'FR': 'EUR', 'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY',
      'ZA': 'ZAR', 'NG': 'NGN', 'UG': 'UGX', 'TZ': 'TZS',
      'AU': 'AUD', 'CA': 'CAD', 'AE': 'AED', 'CH': 'CHF',
      'BR': 'BRL', 'MX': 'MXN', 'SG': 'SGD', 'RW': 'RWF',
    };
    return map[code] || 'USD';
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar() { this.sidebarOpen = false; }
  onSearch() {}
  logout() { this.auth.logout(); }
}