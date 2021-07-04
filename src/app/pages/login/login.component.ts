import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService } from '../../shared-services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss'
    ]
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup = this.formBuilder.group({
        userName: [
            '',
            Validators.required
        ],
        password: [
            '',
            Validators.required
        ]
    });
    submitted:Boolean = false;
    returnUrl: string = '';
    showErrorMessage: Boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        public authService: AuthService
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate([
                '/'
            ]);
        }
    }

    ngOnInit() {
        this.getLoginForm();

        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    getLoginForm() {
        console.log('getLoginForm() invoked');

        this.loginForm = this.formBuilder.group({
            username: [
                '',
                Validators.required
            ],
            password: [
                '',
                Validators.required
            ]
        });
    }

    // convenience getter for easy access to form fields
    get formControls() {
        return this.loginForm.controls;
    }

    resetErrorMessage() {
        this.showErrorMessage = false;
    }

    onSubmit() {

        if (this.loginForm.invalid) {
            return;
        }

        this.showErrorMessage = false;

        this.authService
            .login(this.formControls.username.value, this.formControls.password.value)
            .pipe(first())
            .subscribe(
                (data) => {
                    this.router.navigate([
                        // this.returnUrl
                        'home'
                    ]);
                },
                (error) => {
                    this.showErrorMessage = true;
                }
            );
    }
}
