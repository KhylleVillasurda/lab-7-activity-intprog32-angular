import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { MustMatch } from '@app/_helpers/must-match.validator';

@Component({ standalone: false, templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  isAddMode = true;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.fb.group({
      title:           ['', Validators.required],
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      role:            ['', Validators.required],
      password:        ['', this.isAddMode ? [Validators.required, Validators.minLength(6)] : []],
      confirmPassword: ['']
    }, { validators: MustMatch('password', 'confirmPassword') });

    if (!this.isAddMode) {
      this.accountService.getById(this.id!).subscribe(account => this.form.patchValue(account));
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    const action = this.isAddMode
      ? this.accountService.create(this.form.value)
      : this.accountService.update(this.id!, this.form.value);

    action.subscribe({
      next: () => {
        this.alertService.success('Account saved.', { keepAfterRouteChange: true });
        this.router.navigate(['/admin/accounts']);
      },
      error: err => {
        this.alertService.error(err);
        this.loading = false;
      }
    });
  }
}
