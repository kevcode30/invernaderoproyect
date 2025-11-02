import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualControlPage } from './manual-control.page';

describe('ManualControlPage', () => {
  let component: ManualControlPage;
  let fixture: ComponentFixture<ManualControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
