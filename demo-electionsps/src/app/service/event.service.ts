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
  private projectName = 'financedemo'; // 🔹 Project name
  private subCollectionName = 'events'; // 🔹 Subcollection name

  constructor(private firestore: AngularFirestore) {}

  // 🔹 Get all events
  getEvents(): Observable<EventItem[]> {
    return this.firestore
      .collection(this.projectName) // Collection: financedemo
      .doc(this.projectName)        // Document: financedemo
      .collection<EventItem>(this.subCollectionName)
      .valueChanges({ idField: 'id' });
  }

  // 🔹 Add event
  addEvent(event: EventItem) {
    return this.firestore
      .collection(this.projectName)
      .doc(this.projectName)
      .collection(this.subCollectionName)
      .add(event);
  }

  // 🔹 Update event
  updateEvent(event: EventItem) {
    return this.firestore
      .collection(this.projectName)
      .doc(this.projectName)
      .collection(this.subCollectionName)
      .doc(event.id)
      .update(event);
  }

  // 🔹 Delete event
  deleteEvent(id: string) {
    return this.firestore
      .collection(this.projectName)
      .doc(this.projectName)
      .collection(this.subCollectionName)
      .doc(id)
      .delete();
  }
}
