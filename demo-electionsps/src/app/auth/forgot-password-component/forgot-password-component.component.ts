import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password-component',
  templateUrl: './forgot-password-component.component.html',
  styleUrls: ['./forgot-password-component.component.css']
})
export class ForgotPasswordComponentComponent implements OnInit {

  email : string = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }

}
