import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage,   private firestore: AngularFirestore) { }

  uploadFile(file: File): Observable<string> {
    const filePath = `Uploads/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            // Save metadata to Firestore
            this.firestore.collection('uploads').add({
              name: file.name,
              path: filePath,
              url: url,
              uploadedAt: new Date()
            }).then(() => {
              observer.next(url);  // return URL to component
              observer.complete();
            });
          });
        })
      ).subscribe();
    });
  }

  // Get all uploaded files from Firestore
  getAllFiles(): Observable<any[]> {
    return this.firestore.collection('uploads', ref => ref.orderBy('uploadedAt', 'desc')).valueChanges();
  }
    // Get download URL for an image
  getImageUrl(path: string): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }
  // Add this method to your StorageService
deleteFile(fileId: string, filePath: string): Promise<void> {
  const fileRef = this.storage.ref(filePath);
  
  // Delete from Storage
  return fileRef.delete().toPromise()
    .then(() => {
      // Delete from Firestore
      return this.firestore.collection('uploads').doc(fileId).delete();
    })
    .catch(error => {
      console.error("Error deleting file:", error);
      throw error;
    });
}
}
