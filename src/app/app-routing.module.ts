import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';



const routes: Routes = [
  // TODO: routing
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'home', component: HomeComponent },
];


// export class AppRoutingModule { }

export const AppRoutingModule = RouterModule.forRoot(routes);