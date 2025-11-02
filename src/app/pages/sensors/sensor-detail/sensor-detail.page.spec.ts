import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SensorDetailPage } from './sensor-detail.page';

describe('SensorDetailPage', () => {
  let component: SensorDetailPage;
  let fixture: ComponentFixture<SensorDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
