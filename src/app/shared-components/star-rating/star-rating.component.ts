import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() numberOfStar = 5;

  currentRating: number = 0;
  isDisabled = false;

  // *ngFor can't iterate on a number
  // so we are going to covert it to an array of [0...n-1]
  public toIterableArray(n:number) {
    return Array.from(Array(n).keys());
  }

  setRating(n:number) {
    if (this.isDisabled) {
      return;
    }
    this.currentRating = n;

    // Notify Angular to update its model
    this.onChange(this.currentRating);
    this.onTouched();
  }

  // Save the callbacks, make sure to have a default so your app
  // doesn't crash when one isn't (yet) registered
  private onChange = (v: any) => {};
  private onTouched = () => {};

  constructor() {}

  writeValue(rating: any): void {
    this.currentRating = rating;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
