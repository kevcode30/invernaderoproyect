import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreenhouseDetailPage } from './greenhouse-detail.page';

describe('GreenhouseDetailPage', () => {
  let component: GreenhouseDetailPage;
  let fixture: ComponentFixture<GreenhouseDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenhouseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
