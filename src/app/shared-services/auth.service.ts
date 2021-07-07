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
    public currentUser: Observable<any>;

    constructor(public router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserModel | null>(
            JSON.parse(localStorage['currentUser'] || null) || {}
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserModel | null {
        return this.currentUserSubject?.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>('/api/login', { username, password }).pipe(
            map((res) => {
                if (res.user) {
                    localStorage.setItem('currentUser', JSON.stringify(res));
                    this.currentUserSubject.next(res);
                }
                return res;
            })
        );
    }

    logout() {
        this.http.get<any>('/api/logout', { observe: 'response' });

        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
