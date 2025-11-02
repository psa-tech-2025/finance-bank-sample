import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { GalleryService, GalleryPhoto } from 'src/app/service/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  galleryPhotos: GalleryPhoto[] = [];
  selectedPhoto: GalleryPhoto = { caption: '', description: '', date: '' };
  selectedFile: File | null = null;
  isAdminLoggedIn = false;
  showForm = false;

  // 🔹 For View Modal
  showViewModal = false;
  viewedPhoto: GalleryPhoto | null = null;

  constructor(private galleryService: GalleryService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAdminLoggedIn = this.auth.isLoggedIn();
    this.fetchGallery();
  }

  fetchGallery() {
    this.galleryService.getAll().subscribe((photos) => {
      this.galleryPhotos = photos;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.selectedPhoto = { caption: '', description: '', date: '' };
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
savePhoto() {
  // Prevent adding more than 10 photos
  if (!this.selectedPhoto.id && this.galleryPhotos.length >= 10) {
    alert('Maximum 10 gallery photos allowed.');
    return;
  }

  if (this.selectedPhoto.id) {
    this.galleryService
      .update(this.selectedPhoto.id, this.selectedPhoto, this.selectedFile || undefined)
      .then(() => this.cancelEdit());
  } else {
    this.galleryService
      .add(this.selectedPhoto, this.selectedFile || undefined)
      .then(() => this.cancelEdit());
  }
}

  editPhoto(photo: GalleryPhoto) {
    this.selectedPhoto = { ...photo };
    this.showForm = true;
  }

  deletePhoto(id?: string) {
    if (id && confirm('Are you sure you want to delete this photo?')) {
      this.galleryService.delete(id);
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.selectedPhoto = { caption: '', description: '', date: '' };
    this.selectedFile = null;
  }

  // 🔹 View Photo Modal
  viewPhoto(photo: GalleryPhoto) {
    this.viewedPhoto = photo;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewedPhoto = null;
  }
}
