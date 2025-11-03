import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface NewsItem {
  id?: string;
  title: string;
  category: string;
  date: string;
  content: string;
  image?: string;
  url?: string;
  likes?: number;
  author?: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  // ✅ Your root project folder
  private projectName = 'financedemo';

  // ✅ Firestore collection inside financedemo
  private newsCollection = collection(this.firestore, `${this.projectName}/data/news`);

  constructor(private firestore: Firestore, private storage: Storage) {}

  /** ✅ Get all news items */
  getAll(): Observable<NewsItem[]> {
    return collectionData(this.newsCollection, { idField: 'id' }) as Observable<NewsItem[]>;
  }

  /** ✅ Add new news item (with optional image upload) */
  async add(news: NewsItem, file?: File): Promise<void> {
    let imageUrl = '';

    if (file) {
      // ✅ Store uploaded file under financedemo/news/
      const path = `${this.projectName}/news/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, path);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(this.newsCollection, { ...news, image: imageUrl });
  }

  /** ✅ Update an existing news item */
  async update(id: string, news: NewsItem, file?: File): Promise<void> {
    const docRef = doc(this.firestore, `${this.projectName}/data/news/${id}`);

    if (file) {
      const path = `${this.projectName}/news/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, path);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      news.image = imageUrl;
    }

    await updateDoc(docRef, { ...news });
  }

  /** ✅ Delete news item (and image if present) */
  async delete(id: string, imageUrl?: string): Promise<void> {
    // Delete from storage first (if exists)
    if (imageUrl) {
      const imgRef = ref(this.storage, imageUrl);
      await deleteObject(imgRef).catch(() => {});
    }

    // Then delete Firestore document
    const docRef = doc(this.firestore, `${this.projectName}/data/news/${id}`);
    await deleteDoc(docRef);
  }
}
