import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';


@Component({
  selector: 'app-public-gallery',
  templateUrl: './public-gallery.component.html',
  styleUrls: ['./public-gallery.component.css']
})
export class PublicGalleryComponent implements OnInit {
   imageUrls: string[] = [];
  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
        // Fetch all uploaded images from Firestore
    this.storageService.getAllFiles().subscribe(files => {
      this.imageUrls = files.map(f => f.url);
    });
  }

}
