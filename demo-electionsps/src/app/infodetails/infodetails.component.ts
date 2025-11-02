import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
interface UserEntry {
  username: string; // logged-in user
  message: string;
  image?: string; // base64 image string
}


@Component({
  selector: 'app-infodetails',
  templateUrl: './infodetails.component.html',
  styleUrls: ['./infodetails.component.css']
})
export class InfodetailsComponent implements OnInit {
    userForm: FormGroup;
  userEntries: UserEntry[] = [];
  currentUser: string | null = '';
  constructor(private fb: FormBuilder, private auth:AuthService) {
        this.userForm = this.fb.group({
      message: ['', Validators.required],
      image: [null]
    });
   }

  ngOnInit(): void {
        this.currentUser = localStorage.getItem('username');

    // Load all entries from local storage
    const data = localStorage.getItem('userEntries');
    if (data) {
      this.userEntries = JSON.parse(data);
    }

  }
  logout() {
    this.auth.logout();
  }

    onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
  saveEntry() {
    if (!this.userForm.valid) return;

    const entry: UserEntry = {
      username: this.currentUser!,
      message: this.userForm.value.message,
      image: this.userForm.value.image
    };

    this.userEntries.push(entry);
    localStorage.setItem('userEntries', JSON.stringify(this.userEntries));

    this.userForm.reset();
  }
    deleteEntry(index: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.userEntries.splice(index, 1);
      localStorage.setItem('userEntries', JSON.stringify(this.userEntries));
    }
  }

    getUserEntries() {
    // Only show entries for logged-in user
    return this.userEntries.filter(e => e.username === this.currentUser);
  }

}
