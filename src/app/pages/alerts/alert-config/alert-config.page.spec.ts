import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertConfigPage } from './alert-config.page';

describe('AlertConfigPage', () => {
  let component: AlertConfigPage;
  let fixture: ComponentFixture<AlertConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
