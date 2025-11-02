import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { AboutService } from 'src/app/service/about.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

   isAdminLoggedIn = false; // Update dynamically from AuthService
    editMode = false;
    contactData: any = {
      name: 'तनाजी सावंत',
      designation: 'आमदार भूम पंढरपूर वाशी',
      party: 'शिवसेना',
      education: 'पदवीधर',
      bio: 'जीवनातील प्रवास आणि सार्वजनिक कार्याचा अनुभव.',
      phone: '+91 1234567890',
      email: 'tanajisawant@shivsena.org',
      address: 'भूम पंढरपूर वाशी, महाराष्ट्र',
      imageUrl: 'assets/images/default-profile.jpg'
    };
  
    constructor(public contactService:AboutService , private fb: FormBuilder, private auth: AuthService) {}
      ngOnInit() {
      // ✅ Subscribe to login state from AuthService
      this.auth.loginStatus$.subscribe(status => {
        this.isAdminLoggedIn = status;
        console.log('Admin logged in:', status);
      });
  
      // Optional: Load saved data
      const savedData = localStorage.getItem('contactData');
      if (savedData) {
        this.contactData = JSON.parse(savedData);
      }
    }  
    
    toggleEditMode() {
      this.editMode = !this.editMode;
    }
  
  
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.contactService.uploadImage(file).subscribe({
          next: (url) => {
            if (url) this.contactData.imageUrl = url;
          },
          error: (err) => console.error('Upload error:', err)
        });
      }
    }
    saveContact() {
      this.contactService.saveContact(this.contactData);
      this.editMode = false;
    }
  
    deleteContact() {
      this.contactService.deleteContact();
      this.editMode = false;
    }
  
    cancelEdit() {
      this.editMode = false;
    }

}
