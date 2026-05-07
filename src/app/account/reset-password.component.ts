import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch } from '@app/_helpers/must-match.validator';

enum TokenStatus { Validating, Valid, Invalid }

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
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.form = this.fb.group({
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: MustMatch('password', 'confirmPassword') });

    this.accountService.validateResetToken(this.token)
      .subscribe({
        next: () => { this.status = TokenStatus.Valid; },
        error: () => { this.status = TokenStatus.Invalid; }
      });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
