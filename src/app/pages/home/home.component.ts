import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ServiceService } from 'src/app/shared-services/service.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ServiceModel } from 'src/app/models/ServiceModel';
import { interval, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/UserModel';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ]
})
export class HomeComponent implements OnInit, OnDestroy {
    public logViewerForm: FormGroup = this.formBuilder.group({
        serviceOptions: [],
        inputFilter: [
            { value: '', disabled: true }
        ],
        inputHighlight: [
            { value: '', disabled: true }
        ]
    });
    public serviceOptions: any[] = [];
    public serviceLogSubscription: Subscription = new Subscription();
    private logViewConsole: any;
    private logContent: string[] = [];
    private logFiltered: Boolean = false;
    private logHighlighted: Boolean = false;
    private currentUser: UserModel = new UserModel();
    private jobPool: any = {};
    private intervalSubscription: Subscription = new Subscription();

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private serviceService: ServiceService
    ) {}

    // life cycle hooks
    ngOnInit(): void {
        this.currentUser = this.authService.currentUserValue;

        // get available services to display
        this.serviceService.getServiceOptions(this.currentUser.id).subscribe((options) => {
            this.serviceOptions = options;
        });

        // set interval for live update
        const logContentInterval = interval(1500);
        this.intervalSubscription = logContentInterval.subscribe(this.updateLogViewerConsole.bind(this));

        // get logviewr console for filtering/highlithing
        this.logViewConsole = document.querySelector('#logviewer-console .console-textarea');
    }

    ngOnDestroy() {
        this.intervalSubscription.unsubscribe();
        this.serviceLogSubscription.unsubscribe();
    }

    // event handlers
    onServiceSelected() {
        this.logFiltered = this.logHighlighted = false;

        // reset form
        this.formControls.inputFilter.setValue('');
        this.formControls.inputHighlight.setValue('');
        this.formControls.inputFilter.enable();
        this.formControls.inputHighlight.enable();

        this.updateLogViewerConsole();
    }

    onFilter() {
        this.logFiltered = this.formControls.inputFilter.value;

        // restrict available form controls on input
        if (this.logFiltered) {
            this.formControls.inputHighlight.disable();
        }
        else {
            this.formControls.inputHighlight.enable();
        }

        this.doAfterInputIsDone(this.filterLog.bind(this), 300);
    }

    onHighlight() {
        this.logHighlighted = this.formControls.inputHighlight.value;

        // restrict available form controls on input
        if (this.logHighlighted) {
            this.formControls.inputFilter.disable();
        }
        else {
            this.formControls.inputFilter.enable();
        }

        this.doAfterInputIsDone(this.highlightLog.bind(this), 400);
    }

    filterLog() {
        const keyword = this.formControls.inputFilter.value.trim();

        if (this.logFiltered && !this.logHighlighted) {
            Array.from(this.logViewConsole.children).forEach((item: any) => {
                if (!item.getAttribute('textarea')) {
                    const re = new RegExp(`(${keyword})`, 'i');
                    const found = item.textContent.match(re);
                    if (found) {
                        if (item.classList.contains('hidden')) {
                            item.classList.remove('hidden');
                        }
                    }
                    else {
                        if (!item.classList.contains('hidden')) {
                            item.classList.add('hidden');
                        }
                    }
                }
            }, '');
        }
        else {
            this.updateLogViewerConsole();
        }
    }

    highlightLog () {
        const keyword = this.formControls.inputHighlight.value.trim();

        if (this.logHighlighted && !this.logFiltered) {
            const lines = this.logContent;

            this.logViewConsole.innerHTML = '';
            let updatedHTML = "";

            for (let line of lines) {
                const re = new RegExp(`(${keyword})`, 'ig');
                let replacement = line.replace(/\n/gi, '<br>');
                replacement = replacement.replace(re, `<span class="highlight">$1</span>`);

                updatedHTML += `<div>${replacement}</div>`;
            }

            this.logViewConsole.innerHTML = updatedHTML;

        }
        else {
            this.updateLogViewerConsole();
        }
    }

    updateLogViewerConsole() {
        if (!this.logFiltered && !this.logHighlighted && this.formControls.serviceOptions.value) {
            const serviceId = this.formControls.serviceOptions.value;
            const url = this.serviceOptions.find((s: ServiceModel) => s.id == serviceId).api_url;

            this.serviceLogSubscription = this.serviceService
                .getServiceLog(`${url}?service_id=${serviceId}`)
                .subscribe((res) => {
                    let lines = this.logContent = res;

                    this.logViewConsole.innerHTML = '';
                    let updatedHTML = "";

                    for (let line of lines) {
                        const replaced = line.replace(/\n/gi, '<br>');
                        updatedHTML += `<div>${replaced}</div>`;
                    }

                    this.logViewConsole.innerHTML = updatedHTML;

                });
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate([
            '/login'
        ]);
    }

    get formControls() {
        return this.logViewerForm.controls;
    }

    doAfterInputIsDone(job: any, timeout: number) {
        if (job in this.jobPool) {
            window.clearTimeout(this.jobPool[job]);
        }
        this.jobPool[job] = window.setTimeout(() => {
            delete this.jobPool[job];
            try {
                job.call();
            } catch (e) {
                console.error('EXCEPTION CAUGHT : ' + job);
            }
        }, timeout);
    }
}
