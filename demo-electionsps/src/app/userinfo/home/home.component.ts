import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/service/event.service';
import { GalleryService } from 'src/app/service/gallery.service';
import { WorkService } from 'src/app/service/work.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stats = [
    { icon: 'fa-solid fa-building', number: '0+', label: 'विकासकामे',path: '/work'  },
    { icon: 'fa-solid fa-calendar-days', number: '0+', label: 'कार्यक्रम', path: '/event' },
    { icon: 'fa-solid fa-clipboard-list', number: '0+', label: 'गॅलरी फोटो',path: '/galaryy'  },
    { icon: 'fa-solid fa-star', number: '5+', label: 'जनसेवा वर्ष',path: '/about'  }
  ];

  constructor(
    private galleryService: GalleryService,
    private workService: WorkService,
    private eventService :EventService,
        private router: Router   // ✅ Inject router
  ) {}

  ngOnInit(): void {
      this.galleryService.getAll().subscribe(data => {
    console.log('Gallery count:', data.length);
  });

  this.workService.getAll().subscribe(data => {
    console.log('Work count:', data.length);
  });
    this.updateGalleryCount();
    this.updateWorkCount();
    this.updateEventCount();
  }

  updateGalleryCount(): void {
    this.galleryService.getAll().subscribe((photos) => {
      if (photos) {
        this.stats[2].number = photos.length + '+';
      }
    });
  }

  updateWorkCount(): void {
    this.workService.getAll().subscribe((works) => {
      if (works) {
        this.stats[0].number = works.length + '+';
      }
    });
  }
  updateEventCount(): void {
  this.eventService.getEvents().subscribe((events) => {
    if (events) {
      this.stats[1].number = events.length + '+';  // Update 2nd stat: कार्यक्रम
    }
  });
}
  // ✅ Redirect function
  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
