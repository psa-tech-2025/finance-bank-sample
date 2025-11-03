import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  contactInfo: any = {
    address: 'N/A',
    phone: 'N/A',
    email: 'N/A',
    facebook: '',
    twitter: '',
    instagram: ''
  };

  constructor(private contactService: ContactService) {}

  async ngOnInit(): Promise<void> {
    try {
      const info = await this.contactService.getAdminContactInfo();
      if (info) {
        this.contactInfo = {
          address: info.address || 'N/A',
          phone: info.phone || 'N/A',
          email: info.email || 'N/A',
          facebook: info.facebook || '',
          twitter: info.twitter || '',
          instagram: info.instagram || ''
        };
      } else {
        console.warn('No contact info found in database.');
      }
    } catch (err) {
      console.error('Error fetching admin contact info:', err);
    }
  }
}
