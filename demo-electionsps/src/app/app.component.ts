import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loading = true;
  title = 'demo-electionsps';
  constructor(private translate: TranslateService) {
 translate.addLangs(['en', 'mr']);
  translate.setDefaultLang('mr');  // ✅ Default Marathi
  translate.use('mr');             // ✅ Always start with Marathi

    // Use browser language if available
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang?.match(/mr|en/) ? browserLang : 'en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit(): void {
        setTimeout(() => {
      this.loading = false;
    }, 2000); 
  }
}
