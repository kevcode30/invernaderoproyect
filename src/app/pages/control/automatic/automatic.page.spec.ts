import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutomaticPage } from './automatic.page';

describe('AutomaticPage', () => {
  let component: AutomaticPage;
  let fixture: ComponentFixture<AutomaticPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
