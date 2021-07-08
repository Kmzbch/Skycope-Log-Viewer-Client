import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from './models/UserModel';
import { AuthService } from './shared-services/auth.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ]
})
export class AppComponent {
    title = 'SkycopeLogViewerClient';

    constructor() {}
}
