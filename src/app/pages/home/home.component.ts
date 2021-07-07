import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ServiceService } from 'src/app/shared-services/service.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ServiceModel } from 'src/app/models/ServiceModel';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ]
})
export class HomeComponent implements OnInit {
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
    private logViewConsole: any;
    private logContent: string = '';
    private isFiltered: Boolean = false;
    private isHighlighted: Boolean = false;
    private loggedInUser: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private serviceService: ServiceService
    ) {}

    // life cycle hooks
    ngOnInit(): void {
        this.authService.currentUser.subscribe((res) => {
            this.loggedInUser = res.user;
            this.serviceService.getServiceOptions(this.loggedInUser.id).subscribe((serviceOptions) => {
                this.serviceOptions = serviceOptions;
            });
        });

        // const logContentInterval = interval(1500).pipe();
        // logContentInterval.subscribe(this.updateLogViewerConsole.bind(this));

        this.logViewConsole = document.querySelector('#logviewer-console .console-textarea');
    }

    get formControls() {
        return this.logViewerForm.controls;
    }

    // event handlers
    onServiceSelected() {
        this.updateLogViewerConsole();
        this.formControls.inputFilter.enable();
        this.formControls.inputHighlight.enable();
    }

    filterLog() {
        const filterBy = this.formControls.inputFilter.value.toLowerCase();
        this.isFiltered = filterBy;

        if (this.isFiltered) {
            const lines = this.logContent.split('\n');

            Array.from(this.logViewConsole.children).forEach((item: any) => {
                if (!item.getAttribute('textarea')) {
                    const querystring = filterBy.trim();
                    const re = new RegExp(`(${querystring})`, 'ig');
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

    highlightLog() {
        const query = this.formControls.inputHighlight.value.toLowerCase();
        this.isHighlighted = query;

        if (this.isHighlighted) {
            let lines = this.logContent.split('\n');

            this.logViewConsole.innerHTML = '';
            for (let line of lines) {
                let replaced = line.replace(/\n/gi, '<br>');
                const querystring = this.formControls.inputHighlight.value.trim().split(' ');
                const re = new RegExp(`(${querystring.join('|')})`, 'gi');
                replaced = replaced.replace(re, `<span class="highlight">$1</span>`);

                this.logViewConsole.innerHTML += `<div>${replaced}</div>`;
            }
        }
        else {
            this.updateLogViewerConsole();
        }
    }

    updateLogViewerConsole() {
        if (!this.isFiltered && !this.isHighlighted && this.formControls.serviceOptions.value) {
            const serviceId = this.formControls.serviceOptions.value;
            const url = this.serviceOptions.find((s:ServiceModel)=>s.id == serviceId).api_url;

            this.serviceService.getServiceLog(`${url}?service_id=${serviceId}`).subscribe((res) => {
                this.logContent = res.raw;
                let lines = res.raw.split('\n');

                this.logViewConsole.innerHTML = '';
                for (let line of lines) {
                    let replaced = line.replace(/\n/gi, '<br>');
                    this.logViewConsole.innerHTML += `<div>${replaced}</div>`;
                }
            });
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate([
            '/login'
        ]);
    }
}
