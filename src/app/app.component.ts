import { Component } from '@angular/core';
import { UserModel } from './models/UserModel';
import { AuthService } from './shared-services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SkycopeLogViewerClient';
  currentUser: UserModel | null = new UserModel();

  constructor(
      private authService: AuthService
  ) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

}
