// footer.component.ts
import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/service/contact.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  contactInfo: any = {
    address: '',
    phone: '',
    email: '',
    facebook: '',
    twitter: '',
    instagram: ''
  };

  constructor(private contactService: ContactService) {}

  async ngOnInit() {
    try {
      const info = await this.contactService.getAdminContactInfo();
      if (info) {
        this.contactInfo = info;
      }
    } catch (err) {
      console.error('Error fetching admin contact info:', err);
    }
  }
}
