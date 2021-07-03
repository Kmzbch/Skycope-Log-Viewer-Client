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
    loading = false;
    submitted = false;
    returnUrl: string = '';

    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        public authService: AuthService,
        private route: ActivatedRoute
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate([
                '/'
            ]);
        }
    }

    ngOnInit() {
        this.getLoginForm();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        console.log("login form is valid");

        this.loading = true;
        this.authService
            .login(this.formControls.username.value, this.formControls.password.value)
            .pipe(first())
            .subscribe(
                (data) => {
                    this.router.navigate([
                        this.returnUrl
                    ]);
                },
                (error) => {
                    this.loading = false;
                }
            );
    }

}