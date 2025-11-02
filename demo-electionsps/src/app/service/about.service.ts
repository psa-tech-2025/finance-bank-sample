import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

      uploadImage(file: File): Observable<string | undefined> {
        const filePath = `contact/${Date.now()}_${file.name}`;
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

        saveContact(data: any) {
    localStorage.setItem('contactData', JSON.stringify(data));
  }

  deleteContact() {
    localStorage.removeItem('contactData');
  }
  
}
