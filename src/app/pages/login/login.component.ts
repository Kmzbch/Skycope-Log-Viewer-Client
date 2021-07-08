import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthService } from '../../shared-services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss'
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup = this.formBuilder.group({
        username: [
            '',
            Validators.required
        ],
        password: [
            '',
            Validators.required
        ]
    });
    public submitted: Boolean = false;
    public showErrorMessage: Boolean = false;
    private subscription: Subscription = new Subscription();
    private returnUrl: string = '';

    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        public authService: AuthService
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate([
                '/home'
            ]);
        }
    }

    // life cycle hooks
    ngOnInit() {
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // event handlers
    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.showErrorMessage = false;

        let username = this.formControls.username.value;
        let password = this.formControls.password.value;

        this.subscription = this.authService.login(username, password).pipe(first()).subscribe(
            (data) => {
                this.router.navigate([
                    '/home'
                ]);
            },
            (error) => {
                this.showErrorMessage = true;
            }
        );
    }

    get formControls() {
        return this.loginForm.controls;
    }

    resetErrorMessage() {
        this.showErrorMessage = false;
    }
}
