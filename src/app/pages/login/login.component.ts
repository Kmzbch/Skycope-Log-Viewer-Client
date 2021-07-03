import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public authService: AuthService
  ) { }

  get formControls() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.getLoginForm();
  }

  getLoginForm() {
    console.log('getLoginForm() invoked');

    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    console.log('login() invoked');

    this.authService.Login(
      this.formControls.userName.value,
      this.formControls.password.value
    );
  }

}
