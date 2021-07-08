import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaExpandedComponent } from './textarea-expanded.component';

describe('TextareaExpandedComponent', () => {
  let component: TextareaExpandedComponent;
  let fixture: ComponentFixture<TextareaExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextareaExpandedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
