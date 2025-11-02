import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 isAdminLoggedIn = false;
  private subscription!: Subscription;
  isEditing = false;

  headerData = {
    image: '',
    name: '',
    designation: ''
  };

  selectedFile: File | null = null;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore,
    private storage: Storage
  ) {
    translate.addLangs(['en', 'mr']);
    translate.setDefaultLang('mr');
  }

  ngOnInit() {
    this.subscription = this.authService.loginStatus$.subscribe(status => {
      this.isAdminLoggedIn = status;
    });
    this.loadHeader();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.authService.logout();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async saveHeader() {
    try {
      let imageUrl = this.headerData.image;

      // 🔸 Upload new image if selected
      if (this.selectedFile) {
        const storageRef = ref(this.storage, `userheader/header.jpg`);
        await uploadBytes(storageRef, this.selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const data = {
        image: imageUrl,
        name: this.headerData.name,
        designation: this.headerData.designation
      };

      const docRef = doc(this.firestore, 'userheader/headerInfo');
      await setDoc(docRef, data);
      this.headerData = data;
      this.isEditing = false;
      alert('Header updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating header');
    }
  }

  async loadHeader() {
    try {
      const docRef = doc(this.firestore, 'userheader/headerInfo');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        this.headerData = snap.data() as any;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async deleteHeader() {
    try {
      const docRef = doc(this.firestore, 'userheader/headerInfo');
      await setDoc(docRef, { image: '', name: '', designation: '' });
      this.headerData = { image: '', name: '', designation: '' };
      alert('Header cleared successfully');
    } catch (err) {
      console.error(err);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadHeader();
  }
}
