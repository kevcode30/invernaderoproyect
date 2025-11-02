import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreenhouseListPage } from './greenhouse-list.page';

describe('GreenhouseListPage', () => {
  let component: GreenhouseListPage;
  let fixture: ComponentFixture<GreenhouseListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenhouseListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
