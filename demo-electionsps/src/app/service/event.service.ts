import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface EventItem {
  id?: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private collectionName = 'events';

  constructor(private firestore: AngularFirestore) {}

  // 🔹 Get all events
  getEvents(): Observable<EventItem[]> {
    return this.firestore.collection<EventItem>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // 🔹 Add event
  addEvent(event: EventItem) {
    return this.firestore.collection(this.collectionName).add(event);
  }

  // 🔹 Update event
  updateEvent(event: EventItem) {
    return this.firestore.collection(this.collectionName).doc(event.id).update(event);
  }

  // 🔹 Delete event
  deleteEvent(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
