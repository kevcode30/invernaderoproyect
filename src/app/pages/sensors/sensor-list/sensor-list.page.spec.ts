import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SensorListPage } from './sensor-list.page';

describe('SensorListPage', () => {
  let component: SensorListPage;
  let fixture: ComponentFixture<SensorListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
