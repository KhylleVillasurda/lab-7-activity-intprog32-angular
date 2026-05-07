import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch } from '@app/_helpers/must-match.validator';

@Component({ standalone: false, templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title:           ['', Validators.required],
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms:     [false, Validators.requiredTrue]
    }, { validators: MustMatch('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.register(this.form.value)
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful. Please check your email for verification.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }
}
