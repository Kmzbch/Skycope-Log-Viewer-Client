import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(public router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User | null>(
            JSON.parse(localStorage.getItem('currentUser') || '{}')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log('Login invoked!');
        return this.http.post<any>(`/users/authenticate`, { username, password }).pipe(
            map((user) => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            })
        );
    }

    logout() {
        // remoe user from localStorage
        localStorage.removeItem('currentUser');
        console.log('Logout invoked!');
        this.currentUserSubject.next(null);
    }
}
