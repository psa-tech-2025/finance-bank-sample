import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from 'src/app/service/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whatsapp-float',
  templateUrl: './whatsapp-float.component.html',
  styleUrls: ['./whatsapp-float.component.css']
})
export class WhatsappFloatComponent implements OnInit, OnDestroy {
  phone: string | null = null;         // raw phone string from Firestore
  phoneDigits: string | null = null;   // sanitized digits-only phone for wa.me
  visible = false;                     // whether floating button is visible
  scrollThreshold = 200;               // show button after scrolling this many px (changeable)
  pollingSub?: Subscription;

  constructor(private contactService: ContactService) {}

  async ngOnInit() {
    // load admin contact info once (you can adapt to realtime if desired)
    try {
      const info = await this.contactService.getAdminContactInfo();
      if (info && info.phone) {
        this.phone = info.phone;
        // sanitize: keep only digits and leading + removed (wa.me expects country code without + or spaces)
        this.phoneDigits = info.phone.replace(/[^\d]/g, '');
      }
    } catch (err) {
      console.error('Error loading contact info for WhatsApp float:', err);
    }

    // initial visibility check (in case page already scrolled)
    this.checkScroll();
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  // show/hide on scroll
  @HostListener('window:scroll', [])
  checkScroll() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.visible = scrolled > this.scrollThreshold && !!this.phoneDigits;
  }

  // open WhatsApp link (web or mobile)
  openWhatsApp() {
    if (!this.phoneDigits) {
      console.warn('WhatsApp phone number not available');
      return;
    }
    // default message
    const message = encodeURIComponent('Hello! I want to connect via the website.');
    const url = `https://wa.me/${this.phoneDigits}?text=${message}`;
    window.open(url, '_blank');
  }
}
