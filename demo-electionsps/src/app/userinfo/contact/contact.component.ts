import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContactService } from 'src/app/service/contact.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  selectedDocument: File | null = null;
  selectedPhoto: File | null = null;
  isUploading = false;
  contactInfo: any;

  constructor(private fb: FormBuilder, private contactService: ContactService,private translate: TranslateService) {
 
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  async ngOnInit() {
  this.contactInfo = await this.contactService.getAdminContactInfo();
}

  onFileSelect(event: any, type: 'document' | 'photo') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'document') this.selectedDocument = file;
      else this.selectedPhoto = file;
    }
  }

  async onSubmit() {
    if (this.contactForm.invalid) return;

    this.isUploading = true;
    const contactData = this.contactForm.value;
    const uploadResults: any = {};

    try {
      if (this.selectedDocument)
        uploadResults.documentUrl = await this.contactService.uploadFile('contact/documents', this.selectedDocument);

      if (this.selectedPhoto)
        uploadResults.photoUrl = await this.contactService.uploadFile('contact/photos', this.selectedPhoto);

      const finalData = { ...contactData, ...uploadResults, date: new Date() };
      await this.contactService.saveContactData(finalData);

      alert('संदेश यशस्वीपणे पाठवला गेला!');
      this.contactForm.reset();
      this.selectedDocument = null;
      this.selectedPhoto = null;
    } catch (err) {
      console.error('Upload Error:', err);
      alert('त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      this.isUploading = false;
    }
  }
}
