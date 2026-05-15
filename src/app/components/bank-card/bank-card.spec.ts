import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCard } from './bank-card';

describe('BankCard', () => {
  let component: BankCard;
  let fixture: ComponentFixture<BankCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BankCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
