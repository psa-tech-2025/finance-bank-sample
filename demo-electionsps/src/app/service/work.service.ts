import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Work {
  id?: string;
  title: string;
  description: string;
  year: string;
  imageUrl?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  private workCollection: AngularFirestoreCollection<Work>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.workCollection = this.afs.collection<Work>('works');
  }

  // ✅ Get all works
  getAll(): Observable<Work[]> {
    return this.workCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Work;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  // ✅ Add new work with optional image upload
  async add(work: Work, file?: File): Promise<void> {
    const createdAt = Date.now();
    let imageUrl = '';

    if (file) {
      const path = `works/${createdAt}_${file.name}`;
      const uploadTask = await this.storage.upload(path, file);
      imageUrl = await uploadTask.ref.getDownloadURL();
    }

    const newWork = { ...work, imageUrl, createdAt };
    await this.workCollection.add(newWork);
  }

  // ✅ Update work
  async update(id: string, work: Work, file?: File): Promise<void> {
    let imageUrl = work.imageUrl;

    if (file) {
      const path = `works/${Date.now()}_${file.name}`;
      const uploadTask = await this.storage.upload(path, file);
      imageUrl = await uploadTask.ref.getDownloadURL();
    }

    await this.workCollection.doc(id).update({ ...work, imageUrl });
  }

  // ✅ Delete work
  delete(id: string): Promise<void> {
    return this.workCollection.doc(id).delete();
  }
}
