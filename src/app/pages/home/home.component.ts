import { Component, OnInit } from '@angular/core';
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
    public textareaContent: string = '';
    // private interval: Observable<number> = new Observable<number>();
    private logContent: string = '';
    private isFiltered: Boolean = false;
    private isHighlighted: Boolean = false;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private serviceService: ServiceService
    ) {
    }

    // life cycle hooks
    ngOnInit(): void {
        this.serviceOptions = this.serviceService.getServices();

        // const logContentInterval = interval(1000).pipe();
        // logContentInterval.subscribe(this.updateLogContent.bind(this));
    }

    // form
    public logViewerForm: FormGroup = this.formBuilder.group({
        serviceOptions: this.serviceOptions,
        inputFilter: '',
        inputHighlight: ''
    });

    get formControls() {
        return this.logViewerForm.controls;
    }

    filterLog() {
        const filterBy = this.formControls.inputFilter.value.toLowerCase();
        this.isFiltered = filterBy;

        if (this.isFiltered) {
            const lines = this.logContent.split('\n');
            // let filetered = lines.filter((line) => line.toLowerCase().includes(filterBy));
            let filetered = lines.filter(
                (line) => line.toLowerCase().indexOf(filterBy) !== -1);
            this.textareaContent = filetered.join('\n');
        }
        else {
            this.getSelectedServiceLog();
        }

    }

    highlightLog() {
        const query = this.formControls.inputHighlight.value.toLowerCase();
        this.isHighlighted = query;
        //
    }

    getSelectedServiceLog() {
        const serviceId = this.formControls.serviceOptions.value;
        const content = this.serviceService.getServiceLog(this.serviceOptions[serviceId - 1].apiUrl);

        // set text content
        this.logContent = content;
        this.textareaContent = content;
    }

    // utility
    updateLogContent() {
        if(!this.isFiltered && this.formControls.serviceOptions.value) {
            this.logContent += "TEST!\n" // simulate
            this.textareaContent = this.logContent;
        }
    }

    // logout
    logout() {
        this.authService.logout();
        this.router.navigate([
            '/login'
        ]);
    }
}
