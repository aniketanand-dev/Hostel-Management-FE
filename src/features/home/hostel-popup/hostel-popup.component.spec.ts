import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelPopupComponent } from './hostel-popup.component';

describe('HostelPopupComponent', () => {
  let component: HostelPopupComponent;
  let fixture: ComponentFixture<HostelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
