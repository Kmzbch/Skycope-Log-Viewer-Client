import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './shared-services/auth.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

import { fakeBackendProvider } from './helpers/fake-backend';
import { ServiceService } from './shared-services/service.service';
import { TextareaExpandedComponent } from './shared-components/textarea-expanded/textarea-expanded.component';
import { StarRatingComponent } from './shared-components/star-rating/star-rating.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TextareaExpandedComponent,
    StarRatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    ServiceService,
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
