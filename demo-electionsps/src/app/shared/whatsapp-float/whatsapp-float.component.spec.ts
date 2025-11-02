import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFloatComponent } from './whatsapp-float.component';

describe('WhatsappFloatComponent', () => {
  let component: WhatsappFloatComponent;
  let fixture: ComponentFixture<WhatsappFloatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappFloatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappFloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
