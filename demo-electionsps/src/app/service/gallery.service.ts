import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

export interface GalleryPhoto {
  id?: string;
  caption: string;
  description: string;
  date: string;
  imageUrl?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private collectionName = 'Gallery';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // 🔹 Fetch all gallery photos
  getAll(): Observable<GalleryPhoto[]> {
    return this.firestore
      .collection<GalleryPhoto>(this.collectionName, (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as GalleryPhoto;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // 🔹 Add new photo
  async add(photo: GalleryPhoto, file?: File): Promise<void> {
    const id = this.firestore.createId();
    const createdAt = Date.now();

    if (file) {
      const filePath = `Gallery/${id}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      await task.snapshotChanges()
        .pipe(
          finalize(async () => {
            const imageUrl = await fileRef.getDownloadURL().toPromise();
            await this.firestore.collection(this.collectionName).doc(id).set({
              ...photo,
              imageUrl,
              createdAt,
            });
          })
        )
        .toPromise();
    } else {
      await this.firestore.collection(this.collectionName).doc(id).set({
        ...photo,
        createdAt,
      });
    }
  }

  // 🔹 Update existing photo
  async update(id: string, photo: GalleryPhoto, file?: File): Promise<void> {
    if (file) {
      const filePath = `Gallery/${id}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      await task.snapshotChanges()
        .pipe(
          finalize(async () => {
            const imageUrl = await fileRef.getDownloadURL().toPromise();
            await this.firestore.collection(this.collectionName).doc(id).update({
              ...photo,
              imageUrl,
            });
          })
        )
        .toPromise();
    } else {
      await this.firestore.collection(this.collectionName).doc(id).update(photo);
    }
  }

  // 🔹 Delete photo
  async delete(id: string): Promise<void> {
    await this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
