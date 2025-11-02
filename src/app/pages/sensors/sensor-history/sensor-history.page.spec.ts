import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SensorHistoryPage } from './sensor-history.page';

describe('SensorHistoryPage', () => {
  let component: SensorHistoryPage;
  let fixture: ComponentFixture<SensorHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
