import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module'; // 👈 Make sure this exists
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { LoaderComponent } from './component/loader/loader.component';
import { LoginComponent } from './login/login.component';
import { InfodetailsComponent } from './infodetails/infodetails.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Firebase modules
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import {AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponentComponent } from './auth/forgot-password-component/forgot-password-component.component';
import { VarifyEmailComponent } from './auth/varify-email/varify-email.component';
import { UserinfoComponent } from './infodetails/userinfo/userinfo.component';
import { FileuploadComponent } from './infodetails/fileupload/fileupload.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserfetchComponent } from './userfetch/userfetch.component';
import { PublicGalleryComponent } from './public-gallery/public-gallery.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminProductFormComponent } from './admin/admin-product-form/admin-product-form.component';
import { PublicProductsComponent } from './public-products/public-products.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ContactComponent } from './userinfo/contact/contact.component';
import { AboutComponent } from './userinfo/about/about.component';
import { EventsComponent } from './userinfo/events/events.component';
import { WorkComponent } from './userinfo/work/work.component';
import { GalleryComponent } from './userinfo/gallery/gallery.component';
import { NewsComponent } from './userinfo/news/news.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { AdminContactComponent } from './userinfo/admin-contact/admin-contact.component';
import { HomeComponent } from './userinfo/home/home.component';
import { WhatsappFloatComponent } from './shared/whatsapp-float/whatsapp-float.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    LoginComponent,
    InfodetailsComponent,
    SignInComponent,
    RegisterComponent,
    ForgotPasswordComponentComponent,
    VarifyEmailComponent,
    UserinfoComponent,
    FileuploadComponent,
    UserfetchComponent,
    PublicGalleryComponent,
    AdminProductsComponent,
    AdminProductFormComponent,
    PublicProductsComponent,
    NavbarComponent,
    ContactComponent,
    AboutComponent,
    EventsComponent,
    WorkComponent,
    GalleryComponent,
    NewsComponent,
    SafeUrlPipe,
    AdminContactComponent,
    HomeComponent,
    WhatsappFloatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    // Initialize Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firestore
    provideFirestore(() => getFirestore()),

    // Storage
    provideStorage(() => getStorage()),
    
       TranslateModule.forRoot({
            defaultLanguage: 'mr', // ✅ Marathi is default
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
