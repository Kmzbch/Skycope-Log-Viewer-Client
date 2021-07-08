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
    public currentUser: Observable<UserModel>;
    private currentUserSubject: BehaviorSubject<UserModel>;

    constructor(public router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserModel>(
            JSON.parse(localStorage['currentUser'] || null) || {}
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    get currentUserValue(): UserModel {
        return this.currentUserSubject?.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>('/api/login', { username, password }).pipe(
            map((res) => {
                if (res.user) {
                    localStorage.setItem('currentUser', JSON.stringify(res.user));
                    this.currentUserSubject.next(res.user);
                }
                return res;
            })
        );
    }

    logout() {
        this.http.get<any>('/api/logout');

        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(new UserModel);
    }
}
