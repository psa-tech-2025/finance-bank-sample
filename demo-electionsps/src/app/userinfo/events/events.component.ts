import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { EventService, EventItem } from 'src/app/service/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: EventItem[] = [];
  isAdminLoggedIn = false;
  isEditing = false;
  selectedEvent: EventItem = this.resetForm();

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdminLoggedIn = this.authService.isLoggedIn() // ✅ check admin properly
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((data) => {
      this.events = data.length > 0 ? data : [
        {
          title: 'Independence Day Celebration',
          description: 'Celebrating the spirit of freedom with cultural programs and activities.',
          location: 'Main Ground, City Hall',
          date: '2025-08-15',
          status: 'upcoming'
        }
      ];
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.selectedEvent = this.resetForm();
  }

  editEvent(event: EventItem) {
    this.isEditing = true;
    this.selectedEvent = { ...event };
  }

  deleteEvent(id?: string) {
    if (id && confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id);
    }
  }

  saveEvent() {
    if (this.selectedEvent.id) {
      this.eventService.updateEvent(this.selectedEvent);
    } else {
      this.eventService.addEvent(this.selectedEvent);
    }
    this.toggleEdit();
  }

  resetForm(): EventItem {
    return {
      title: '',
      description: '',
      location: '',
      date: '',
      status: 'upcoming'
    };
  }
}
