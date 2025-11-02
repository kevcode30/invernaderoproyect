import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertListPage } from './alert-list.page';

describe('AlertListPage', () => {
  let component: AlertListPage;
  let fixture: ComponentFixture<AlertListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
