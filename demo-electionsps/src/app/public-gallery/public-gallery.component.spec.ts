import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGalleryComponent } from './public-gallery.component';

describe('PublicGalleryComponent', () => {
  let component: PublicGalleryComponent;
  let fixture: ComponentFixture<PublicGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
