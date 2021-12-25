import { Component, Input } from '@angular/core';

@Component({
  selector: 'error-message',
  template: `
    <ng-template [ngIf]="controlName && controlName[formControlKey]">
      <div
        class="error-list"
        *ngIf="
          controlName[formControlKey] &&
          controlName[formControlKey].errors &&
          (controlName[formControlKey].dirty ||
            controlName[formControlKey].touched ||
            submitting)
        "
      >
        <span
          class="error-message"
          *ngIf="controlName[formControlKey]?.errors && controlName[formControlKey]?.errors?.['required'];
                else invalid_error
              "
        >
          This field can't be left blank</span
        >
        <ng-template #invalid_error>
          <span
            class="error-message"
            *ngIf="controlName[formControlKey].invalid"
          >
            {{ invalidErrorMessage }}
          </span>
        </ng-template>
      </div>
    </ng-template>
  `,
})
export class ErrorMessageComponent {
  @Input('controlName') controlName: any;
  @Input('submitting') submitting: boolean;
  @Input('formControlKey') formControlKey: string;
  @Input('invalidErrorMessage') invalidErrorMessage: string;
}
