import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-userfetch',
  templateUrl: './userfetch.component.html',
  styleUrls: ['./userfetch.component.css']
})
export class UserfetchComponent implements OnInit {

    images: any[] = []; // will store {id, url, path}

  constructor(private storageService: StorageService,private auth: AuthService) {}

  ngOnInit(): void {
    this.loadImages();
  }
  logout() {
     this.auth.logout();
  }
  loadImages() {
    this.storageService.getAllFiles().subscribe(files => {
      // Store both Firestore doc ID and URL
      this.images = files.map((f: any & {id?: string}) => ({
        id: f.id, // will be available if you query doc IDs
        url: f.url,
        path: f.path
      }));
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.storageService.uploadFile(file).subscribe(url => {
        // After upload, reload images
        this.loadImages();
      });
    }
  }

deleteImage(image: any) {
  if (confirm("Are you sure you want to delete this image?")) {
    this.storageService.deleteFile(image.id, image.path)
      .then(() => {
        // Remove from local array immediately
        this.images = this.images.filter(img => img.id !== image.id);
      })
      .catch(err => console.error(err));
  }
}

  }


