import { Injectable } from '@angular/core';
import {AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // BehaviorSubject to track login state
  private loginStatus = new BehaviorSubject<boolean>(this.hasToken());
  loginStatus$ = this.loginStatus.asObservable();
    isAdminLoggedIn = false;
  constructor(private fireauth:AngularFireAuth, private router:Router) { 

  }
  // login Method
  // login Method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(() => {
      localStorage.setItem('token', 'true');
      this.loginStatus.next(true);  // 🔔 Notify subscribers
      this.router.navigate(['/about']);
    }, err => {
      alert('Something went wrong');
      this.router.navigate(['/login']);
    });
  }

    register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.sendEmailForVarification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

    sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/varify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.loginStatus.next(false);  // 🔔 Notify subscribers
      this.router.navigate(['/login']);
    }, err => {
      alert('Logout failed');
    });
  }

    // check if token exists
  hasToken(): boolean {
    return localStorage.getItem('token') === 'true';
  }
    isLoggedIn(): boolean {
    return this.loginStatus.value;
  }
    // check if logged in
  // isLoggedIn(): boolean {
  //   return localStorage.getItem('token') === 'true';
  // }

    // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

    // email varification
  // sendEmailForVarification(user : any) {
  //   console.log(user);
  //   user.sendEmailVerification().then((res : any) => {
  //     this.router.navigate(['/varify-email']);
  //   }, (err : any) => {
  //     alert('Something went wrong. Not able to send mail to your email.')
  //   })
  // }
    //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/dashboard']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }
}
