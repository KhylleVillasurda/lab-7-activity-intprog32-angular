import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control  = group.get(controlName);
    const matching = group.get(matchingControlName);
    if (!control || !matching) return null;
    if (matching.errors && !matching.errors['mustMatch']) return null;

    if (control.value !== matching.value) {
      matching.setErrors({ mustMatch: true });
    } else {
      matching.setErrors(null);
    }
    return null;
  };
}
