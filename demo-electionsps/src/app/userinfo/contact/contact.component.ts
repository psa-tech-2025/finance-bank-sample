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

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    // Initialize contact form
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });

    // Fetch admin contact info for display
    try {
      this.contactInfo = await this.contactService.getAdminContactInfo();
    } catch (error) {
      console.error('Failed to load admin contact info:', error);
    }
  }

  /** 📁 Handle file selection for document/photo */
  onFileSelect(event: any, type: 'document' | 'photo') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'document') this.selectedDocument = file;
    if (type === 'photo') this.selectedPhoto = file;
  }

  /** 🚀 Handle contact form submission */
  async onSubmit() {
    if (this.contactForm.invalid) {
      alert('कृपया सर्व आवश्यक माहिती भरा!');
      return;
    }

    this.isUploading = true;
    const contactData = this.contactForm.value;
    const uploadResults: any = {};

    try {
      console.log('📤 Upload started...');

      // ✅ Upload document → financedemo/contact/documents/
      if (this.selectedDocument) {
        uploadResults.documentUrl = await this.contactService.uploadFile('documents', this.selectedDocument);
        console.log('✅ Document uploaded:', uploadResults.documentUrl);
      }

      // ✅ Upload photo → financedemo/contact/photos/
      if (this.selectedPhoto) {
        uploadResults.photoUrl = await this.contactService.uploadFile('photos', this.selectedPhoto);
        console.log('✅ Photo uploaded:', uploadResults.photoUrl);
      }

      // ✅ Merge data and save to Firestore collection: financedemo_contacts
      const finalData = { ...contactData, ...uploadResults, date: new Date() };
      await this.contactService.saveContactData(finalData);
      console.log('✅ Data saved to Firestore:', finalData);

      alert('संदेश यशस्वीपणे पाठवला गेला!');
      this.contactForm.reset();
      this.selectedDocument = null;
      this.selectedPhoto = null;
    } catch (err) {
      console.error('❌ Upload/Save Error:', err);
      alert('त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      this.isUploading = false;
    }
  }
}
