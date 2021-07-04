import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/UserModel';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<UserModel | null>;
    public currentUser: Observable<UserModel | null>;

    constructor(public router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserModel | null>(
            JSON.parse(localStorage['currentUser'] || null) || {}
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserModel | null {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`/users/authenticate`, { username, password }).pipe(
            map((user) => {
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
        // remove user from localStorage
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
