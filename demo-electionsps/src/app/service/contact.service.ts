import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { Firestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private projectName = 'financedemo'; // 🔹 Your project name
  private baseFolder = `${this.projectName}/contact`; // 🔹 For storage folders

  constructor(private storage: Storage, private firestore: Firestore) {}

  // ✅ Upload logo or contact image
  async uploadFile(folder: string, file: File): Promise<string> {
    const filePath = `${this.baseFolder}/${folder}/${uuidv4()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  // ✅ Save user-submitted contact data
  async saveContactData(contact: any): Promise<void> {
    const contactRef = collection(this.firestore, `${this.projectName}_contacts`);
    await addDoc(contactRef, contact);
  }

  // ✅ Get all contacts
  async getAllContacts(): Promise<any[]> {
    const contactRef = collection(this.firestore, `${this.projectName}_contacts`);
    const snapshot = await getDocs(contactRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // ✅ Save admin contact info
  async saveAdminContactInfo(data: any): Promise<void> {
    const contactInfoRef = doc(this.firestore, `${this.projectName}_config/contactInfo`);
    await setDoc(contactInfoRef, data, { merge: true });
  }

  // ✅ Get admin contact info
  async getAdminContactInfo(): Promise<any | null> {
    const contactInfoRef = doc(this.firestore, `${this.projectName}_config/contactInfo`);
    const snapshot = await getDoc(contactInfoRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  // ✅ Save header settings
  async saveHeaderSettings(data: any): Promise<void> {
    const headerRef = doc(this.firestore, `${this.projectName}_config/headerSettings`);
    await setDoc(headerRef, data, { merge: true });
  }

  // ✅ Get header settings
  async getHeaderSettings(): Promise<any | null> {
    const headerRef = doc(this.firestore, `${this.projectName}_config/headerSettings`);
    const snapshot = await getDoc(headerRef);
    return snapshot.exists() ? snapshot.data() : null;
  }
}
