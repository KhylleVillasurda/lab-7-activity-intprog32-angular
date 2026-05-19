import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { finalize } from 'rxjs/operators';

enum TokenStatus { Validating, Valid, Invalid, Missing }

@Component({ standalone: false, templateUrl: 'reset-password.component.html' })
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  status = TokenStatus.Validating;
  form!: FormGroup;
  loading = false;
  submitted = false;
  private token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.status = TokenStatus.Invalid;
      return;
    }

    this.form = this.fb.group({
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: MustMatch('password', 'confirmPassword') });

    this.accountService.validateResetToken(this.token)
      .subscribe({
        next: () => { 
            console.log('Token is valid'); 
            this.status = TokenStatus.Valid; 
            this.cdr.detectChanges();
        },
        error: (err) => { 
            console.error('Token validation failed', err); 
            this.status = TokenStatus.Invalid; 
            this.cdr.detectChanges();
        }
      });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful, you can now log in.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: err => this.alertService.error(err)
      });
  }
}
