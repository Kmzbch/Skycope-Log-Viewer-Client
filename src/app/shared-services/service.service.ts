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

    getServiceLog(url: string): Observable<string[]> {
        return this.http.get<any>(url).pipe(
          map((res)=>{
            let lines = res.raw.split('\n');
            // get only the 300 latest lines of log
            lines = lines.splice(-300);
            return lines;
          })
        );
    }

    public getServiceOptions(userId: number): Observable<ServiceModel[]> {
        return this.http.get<any>(`/api/services?user_id=${userId}`).pipe(
            map((res) => {
                return res.result;
            })
        );
    }
}
