import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  private projectName = 'financedemo'; // 🔹 Project name prefix
  private contactCollection = 'about' // 🔹 Collection name

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // 🔹 Upload image to Firebase Storage
  uploadImage(file: File): Observable<string | undefined> {
    const filePath = `${this.projectName}/about/${Date.now()}_${file.name}`; // 🔹 project-based path
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string | undefined>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe({
            next: (url) => {
              observer.next(url);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        })
      ).subscribe();
    });
  }

  // 🔹 Save contact data to Firestore
  saveContact(data: any) {
    return this.firestore.collection(this.contactCollection).add(data);
  }

  // 🔹 Delete all local contact data
  deleteContact() {
    localStorage.removeItem('contactData');
  }
}
