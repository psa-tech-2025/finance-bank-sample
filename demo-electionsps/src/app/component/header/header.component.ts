import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/service/contact.service';
import { HeaderConfigService } from 'src/app/service/header-config.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   titleText = 'My Party';
  logoUrl = 'assets/default-logo.png';
  subs: Subscription[] = [];

  constructor(
    private contactService: ContactService,
    private headerConfigService: HeaderConfigService
  ) {}

  async ngOnInit() {
    // 1) load saved settings from Firestore once at startup
    const data = await this.contactService.getHeaderSettings();
    if (data) {
      this.titleText = data.title || this.titleText;
      this.logoUrl = data.logoUrl || this.logoUrl;
    }

    // 2) subscribe to in-app updates (from admin after save)
    this.subs.push(
      this.headerConfigService.logo$.subscribe(url => {
        if (url) this.logoUrl = url;
      })
    );
    this.subs.push(
      this.headerConfigService.title$.subscribe(t => {
        if (t) this.titleText = t;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
