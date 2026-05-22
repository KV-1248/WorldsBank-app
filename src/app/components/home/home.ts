import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Banks } from '../../services/bank';

@Component({
  selector: 'app-home',
  imports: [DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly bankService = inject(Banks);
  protected readonly banks = this.bankService.filteredBanks;

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.bankService.setSearchQuery(input.value);
  }
}
