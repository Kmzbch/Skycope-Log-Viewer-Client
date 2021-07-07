import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceModel } from 'src/app/models/ServiceModel';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    constructor(public router: Router, private http: HttpClient, private authService: AuthService) {}

    getServiceLog(url: string): Observable<any> {
        return this.http.get<any>(url);
    }

    public getServiceOptions(userId: number): Observable<ServiceModel[]> {
        return this.http.get<any>(`/api/services?user_id=${userId}`).pipe(
            map((res) => {
                return res.result;
            })
        );
    }
}
