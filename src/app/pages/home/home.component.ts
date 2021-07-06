import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ServiceModel } from 'src/app/models/ServiceModel';
import { ServiceService } from 'src/app/shared-services/service.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ]
})
export class HomeComponent implements OnInit {
    public serviceOptions: ServiceModel[] = [];
    private logContent: string = '';
    private isFiltered: Boolean = false;
    private logViewConsole: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private serviceService: ServiceService
    ) {}

    // life cycle hooks
    ngOnInit(): void {
        this.serviceOptions = this.serviceService.getServices();

        // const logContentInterval = interval(1000).pipe();
        // logContentInterval.subscribe(this.updateLogContent.bind(this));

        this.logViewConsole = document.querySelector('#logviewer-console .console-textarea');
    }

    // form
    public logViewerForm: FormGroup = this.formBuilder.group({
        serviceOptions: this.serviceOptions,
        inputFilter: [
            { value: '', disabled: true }
        ],
        inputHighlight: [
            { value: '', disabled: true }
        ]
    });

    get formControls() {
        return this.logViewerForm.controls;
    }

    onServiceSelected() {
        this.getSelectedServiceLog();
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
            this.getSelectedServiceLog();
        }
    }

    highlightLog() {
        const query = this.formControls.inputHighlight.value.toLowerCase();

        // let lines = this.textareaContent.split('\n');
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

    getSelectedServiceLog() {
        const serviceId = this.formControls.serviceOptions.value;
        // const content = this.serviceService.getServiceLog(this.serviceOptions[serviceId - 1].apiUrl);

        this.serviceService.testGetLog().subscribe((res) => {
            this.logContent = res.raw;
            let lines = res.raw.split('\n');

            this.logViewConsole.innerHTML = '';
            for (let line of lines) {
                let replaced = line.replace(/\n/gi, '<br>');
                this.logViewConsole.innerHTML += `<div>${replaced}</div>`;
            }
        });
    }

    // utility
    updateLogContent() {
        if (!this.isFiltered && this.formControls.serviceOptions.value) {
            this.logViewConsole.insertAdjacentHTML('beforeend', '<div>TEST!</div>');
            this.logContent += 'TEST!\n'; // simulate
            this.logViewConsole.innerHTML = this.logContent.replace(/\n/gi, '<br>');
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate([
            '/login'
        ]);
    }
}
