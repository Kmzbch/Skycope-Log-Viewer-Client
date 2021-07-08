import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceModel } from 'src/app/models/ServiceModel';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    constructor(public router: Router, private http: HttpClient) {}

    getServiceLog(url: string): Observable<string[]> {
        return this.http.get<any>(url).pipe(
            map((res) => {
                let lines = res.content.split('\n');
                lines = lines.splice(-10000); // get only the 10000 latest lines for performance
                return lines;
            })
        );
    }

    getServiceOptions(userId: number): Observable<ServiceModel[]> {
        return this.http.get<any>(`/api/services`, { params: { user_id: userId } }).pipe(
            map((res) => {
                return res.services;
            })
        );
    }
}
