import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';

enum VerifyStatus { Verifying, Failed }

@Component({ standalone: false, templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
  VerifyStatus = VerifyStatus;
  status = VerifyStatus.Verifying;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.accountService.verifyEmail(token)
      .subscribe({
        next: () => {
          this.alertService.success('Email verified. You can now log in.', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: () => { this.status = VerifyStatus.Failed; }
      });
  }
}
