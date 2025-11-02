import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collection = 'products';

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // ✅ Add Product
  addProduct(product: Partial<Product>, file?: File): Observable<void | string> {
    if (!file) {
      const docRef = this.afs.collection<Product>(this.collection).add({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      return new Observable(observer => {
        docRef.then(() => {
          observer.next();
          observer.complete();
        }).catch(err => observer.error(err));
      });
    }

    const id = this.afs.createId();
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `Uploads/products/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const url = await fileRef.getDownloadURL().toPromise();
            await this.afs.collection(this.collection).doc(id).set({
              ...product,
              productId: id,
              imageUrl: url,
              imagePath: filePath,
              createdAt: new Date(),
              updatedAt: new Date()
            } as any);
            observer.next(url);
            observer.complete();
          } catch (err) {
            observer.error(err);
          }
        })
      ).subscribe();
    });
  }

  // ✅ Update Product (Safe for undefined docSnap)
  updateProduct(id: string, data: Partial<Product>, file?: File): Observable<void | string> {
    if (!file) {
      return new Observable(observer => {
        this.afs.collection(this.collection).doc(id).update({
          ...data,
          updatedAt: new Date()
        }).then(() => {
          observer.next();
          observer.complete();
        }).catch(err => observer.error(err));
      });
    }

    const newFileName = `${Date.now()}_${file.name}`;
    const newPath = `Uploads/products/${newFileName}`;
    const newRef = this.storage.ref(newPath);
    const task = this.storage.upload(newPath, file);

    return new Observable(observer => {
      task.snapshotChanges().pipe(finalize(async () => {
        try {
          const docSnap = await this.afs.collection(this.collection).doc(id).get().toPromise();

          // ✅ Check if docSnap exists and has data
          const oldData = docSnap?.data() as Product | undefined;

          if (oldData?.imagePath) {
            await this.storage.ref(oldData.imagePath).delete().toPromise().catch(() => {});
          }

          const url = await newRef.getDownloadURL().toPromise();

          await this.afs.collection(this.collection).doc(id).update({
            ...data,
            imageUrl: url,
            imagePath: newPath,
            updatedAt: new Date()
          } as any);

          observer.next(url);
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      })).subscribe();
    });
  }

  // ✅ Delete Product (Safe for undefined snap)
  async deleteProduct(id: string): Promise<void> {
    const snap = await this.afs.collection(this.collection).doc(id).get().toPromise();

    const data = snap?.data() as Product | undefined;

    if (data?.imagePath) {
      try {
        await this.storage.ref(data.imagePath).delete().toPromise();
      } catch (e) {
        console.warn('Image deletion skipped:', e);
      }
    }

    return this.afs.collection(this.collection).doc(id).delete();
  }

  // ✅ Get all products
  getProducts(): Observable<Product[]> {
    return this.afs
      .collection<Product>(this.collection, ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  // ✅ Get product by ID
  getProductById(id: string): Observable<Product | undefined> {
    return this.afs
      .collection(this.collection)
      .doc<Product>(id)
      .valueChanges({ idField: 'id' });
  }

  // ✅ Search products by name (case-insensitive)
  searchProducts(name: string): Observable<Product[]> {
    return this.afs.collection<Product>(this.collection, ref =>
      ref.orderBy('nameLower')
        .startAt(name.toLowerCase())
        .endAt(name.toLowerCase() + '\uf8ff')
    ).valueChanges({ idField: 'id' });
  }
}
