// src/app/userinfo/admin-contact/admin-contact.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/service/contact.service';
import { HeaderConfigService } from 'src/app/service/header-config.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css']
})
export class AdminContactComponent implements OnInit {
  headerForm!: FormGroup;
  adminContactForm!: FormGroup;
  logoFile: File | null = null;
  selectedLogoPreview: string | null = null;
  message = '';
  isAdmin = false;
  contacts: any[] = [];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private headerService: HeaderConfigService,
    private auth: AuthService
  ) {
    this.adminContactForm = this.fb.group({
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facebook: [''],
      twitter: [''],
      instagram: ['']
    });

    this.headerForm = this.fb.group({
      title: [''],
      logoUrl: ['']
    });
  }

  async ngOnInit() {
    this.isAdmin = this.auth.isLoggedIn();
    if (this.isAdmin) {
      this.contacts = await this.contactService.getAllContacts();
    }
    const contactInfo = await this.contactService.getAdminContactInfo();
    if (contactInfo) this.adminContactForm.patchValue(contactInfo);

    // load header settings (if any)
    const header = await this.contactService.getHeaderSettings();
    if (header) {
      this.headerForm.patchValue({ title: header.title || '', logoUrl: header.logoUrl || '' });
      this.selectedLogoPreview = header.logoUrl || null;
      // also notify header service initially
      if (header.logoUrl) this.headerService.setHeaderLogo(header.logoUrl);
      if (header.title) this.headerService.setHeaderTitle(header.title);
    }
    this.loading = false;
  }

  onLogoSelect(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.logoFile = file;                 // << important
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedLogoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async updateHeaderSettings() {
    try {
      const data: any = { ...this.headerForm.value };

      // If a new logo file is uploaded => upload first and set logoUrl
      if (this.logoFile) {
        console.log('Uploading logo file...', this.logoFile.name);
        data.logoUrl = await this.contactService.uploadFile('header', this.logoFile);
        console.log('Uploaded logo url:', data.logoUrl);
      }

      // Ensure data has at least title or logoUrl to avoid blanking
      if (!data.title && !data.logoUrl) {
        this.message = 'Please provide a title or choose a logo.';
        return;
      }

      await this.contactService.saveHeaderSettings(data);
      this.message = '✅ Header settings updated successfully!';

      // notify header component immediately
      if (data.logoUrl) this.headerService.setHeaderLogo(data.logoUrl);
      if (data.title) this.headerService.setHeaderTitle(data.title);

      // refresh headerForm values (especially logoUrl)
      this.headerForm.patchValue({ title: data.title || '', logoUrl: data.logoUrl || '' });
      // clear logoFile so next save doesn't re-upload unless new chosen
      this.logoFile = null;
    } catch (err) {
      console.error('updateHeaderSettings error', err);
      this.message = 'Error updating header settings.';
    }
  }

  // existing admin contact save function
  async saveAdminContactInfo() {
    if (this.adminContactForm.invalid) return;
    await this.contactService.saveAdminContactInfo(this.adminContactForm.value);
    alert('Contact info updated successfully!');
  }
}
