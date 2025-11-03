import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly allowedEmail = 'services@gmail.com';
  private readonly allowedPassword = 'psa@123';
  private loginStatus = new BehaviorSubject<boolean>(this.hasToken());
  loginStatus$ = this.loginStatus.asObservable();

  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  /** ✅ Fixed login — only 1 allowed account */
login(email: string, password: string) {
  // Only allow the admin credentials
  if (email !== 'services@gmail.com' || password !== 'psa@123') {
    alert('Unauthorized user');
    return;
  }

  this.fireauth.signInWithEmailAndPassword(email, password).then(() => {
    localStorage.setItem('token', 'true');
    this.loginStatus.next(true);
    this.router.navigate(['/about']);
  }).catch(() => {
    alert('Invalid login credentials');
  });
}


  /** 🚫 Disable registration for this project */
  register(): void {
    alert('Registration is disabled for this application.');
  }

  /** ✅ Forgot password only for fixed account */
  async forgotPassword(email: string): Promise<void> {
    if (email !== this.allowedEmail) {
      alert('Only authorized email can reset password.');
      return;
    }

    try {
      await this.fireauth.sendPasswordResetEmail(email);
      alert('Password reset link sent to your email.');
      this.router.navigate(['/varify-email']);
    } catch (err) {
      alert('Something went wrong.');
    }
  }

  logout(): void {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.loginStatus.next(false);
      this.router.navigate(['/login']);
    });
  }

  hasToken(): boolean {
    return localStorage.getItem('token') === 'true';
  }

  isLoggedIn(): boolean {
    return this.loginStatus.value;
  }
}
