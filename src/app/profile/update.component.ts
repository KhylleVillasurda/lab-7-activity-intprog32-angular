import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch } from '@app/_helpers/must-match.validator';

@Component({ standalone: false, templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  deleting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const account = this.accountService.accountValue!;
    this.form = this.fb.group({
      title:           [account.title, Validators.required],
      firstName:       [account.firstName, Validators.required],
      lastName:        [account.lastName, Validators.required],
      email:           [account.email, [Validators.required, Validators.email]],
      password:        [''],
      confirmPassword: ['']
    }, { validators: MustMatch('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.update(this.accountService.accountValue!.id, this.form.value)
      .subscribe({
        next: () => {
          this.alertService.success('Profile updated.', { keepAfterRouteChange: true });
          this.router.navigate(['/profile']);
        },
        error: err => {
          this.alertService.error(err);
          this.loading = false;
        }
      });
  }

  onDelete() {
    if (!confirm('Are you sure you want to delete your account?')) return;
    this.deleting = true;
    this.accountService.delete(this.accountService.accountValue!.id)
      .subscribe({ error: err => this.alertService.error(err) });
  }
}
