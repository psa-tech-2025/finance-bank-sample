import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
  errorMessage = '';
    // Default admin credentials
  defaultAdmin = {
    username: 'admin',
    password: 'admin123'
  };
  
  constructor(private fb: FormBuilder, private router: Router) { 
        this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
    login() {
    const { username, password } = this.loginForm.value;

    if (username === this.defaultAdmin.username && password === this.defaultAdmin.password) {
      // Save admin status in local storage
      localStorage.setItem('isAdmin', 'true');
      this.router.navigate(['/info']); // Redirect to admin page
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  ngOnInit(): void {
  
  }
}
