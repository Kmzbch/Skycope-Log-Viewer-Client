import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  // user: Observable<unknown>;
  loggedInUser: any;

  constructor(
    public router: Router,
    // private http: HttpClient,
  ) { 

  }

  Login(username:string, password:string) {
    console.log('Login invoked!');    
  }

  // get isLoggedIn(): boolean {

  // }

  Logout() {
    console.log('Logout invoked!');
  }

}
