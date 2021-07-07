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
        username: [
            '',
            Validators.required
        ],
        password: [
            '',
            Validators.required
        ]
    });
    submitted: Boolean = false;
    returnUrl: string = '';
    showErrorMessage: Boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        public authService: AuthService
    ) {
        if (this.authService.currentUserValue) {
            console.log("!!!!!!!!!!!!");

            this.router.navigate([
                '/'
            ]);
        }
    }

    // life cycle hooks
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // event handlers
    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.showErrorMessage = false;

        let username = this.formControls.username.value;
        let password = this.formControls.password.value;

        this.authService.login(username, password).pipe(first()).subscribe(
            (data) => {
                this.router.navigate([
                    this.returnUrl
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
