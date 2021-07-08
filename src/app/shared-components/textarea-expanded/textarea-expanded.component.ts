import { Component, forwardRef, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'textarea-expanded',
    templateUrl: './textarea-expanded.component.html',
    styleUrls: [
        './textarea-expanded.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaExpandedComponent),
            multi: true
        }
    ]
})
export class TextareaExpandedComponent implements ControlValueAccessor {
    @ViewChild('textarea') textarea: any;
 
    private isDisabled = false;
    private onChange = (v: any) => {};
    private onTouched = () => {};

    constructor(private renderer: Renderer2) {}

    writeValue(value: any): void {
        const div = this.textarea.nativeElement;

        this.renderer.setProperty(div, 'textContent', value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    change($event: any) {
        this.onChange($event.target.textContent);
    }

    setDisabledState(isDisabled: boolean) {
        const div = this.textarea.nativeElement;
        const action = isDisabled ? 'addClass' : 'removeClass';
        this.renderer[action](div, 'disabled');
    }
}
