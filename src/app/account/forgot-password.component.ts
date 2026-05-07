import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';

@Component({ standalone: false, templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.forgotPassword(this.f['email'].value)
      .subscribe({
        next: () => this.alertService.success('Check your email for password reset instructions.'),
        error: err => this.alertService.error(err),
        complete: () => { this.loading = false; }
      });
  }
}
