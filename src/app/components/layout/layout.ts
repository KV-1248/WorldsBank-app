import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { LocationService } from '../../services/location';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  private auth = inject(Auth);
  private locationService = inject(LocationService);

  sidebarOpen = false;
  searchQuery = '';
  isDarkMode = signal(true);
  showLocationToast = signal(false);

  userName = computed(() => this.auth.currentUser() || 'User');
  userInitial = computed(() =>
    (this.auth.currentUser() || 'U').charAt(0).toUpperCase()
  );

  // Expose location signals to template
  locationReady = this.locationService.locationReady;
  detectedCountry = this.locationService.detectedCountry;
  detectedCurrency = this.locationService.detectedCurrency;

  ngOnInit() {
    const saved = localStorage.getItem('wb_theme');
    if (saved === 'light') {
      this.isDarkMode.set(false);
      document.body.classList.add('light-mode');
    }
    this.detectLocation();
  }

  detectLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then(res => res.json())
          .then(data => {
            const country = data.address?.country || 'Unknown';
            const countryCode = data.address?.country_code?.toUpperCase() || 'US';
            const prevCode = this.locationService.detectedCountryCode();

            this.locationService.setLocation(country, countryCode);

            // Show toast only when location changes
            if (countryCode !== prevCode) {
              this.showLocationToast.set(true);
              setTimeout(() => this.showLocationToast.set(false), 5000);
            }
          })
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 10000 }
    );
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

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar() { this.sidebarOpen = false; }
  onSearch() {}
  logout() { this.auth.logout(); }
}