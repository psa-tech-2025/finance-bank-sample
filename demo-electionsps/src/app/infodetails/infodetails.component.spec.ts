import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfodetailsComponent } from './infodetails.component';

describe('InfodetailsComponent', () => {
  let component: InfodetailsComponent;
  let fixture: ComponentFixture<InfodetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfodetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
