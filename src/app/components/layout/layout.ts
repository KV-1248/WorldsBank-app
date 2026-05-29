import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private auth = inject(Auth);

  sidebarOpen = false;
  searchQuery = '';

  userName = computed(() => this.auth.currentUser() || 'User');
  userInitial = computed(() =>
    (this.auth.currentUser() || 'U').charAt(0).toUpperCase()
  );

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onSearch() {
    // Search logic handled by individual components
  }

  logout() {
    this.auth.logout();
  }
}