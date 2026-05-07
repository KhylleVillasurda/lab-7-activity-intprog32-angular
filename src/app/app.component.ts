import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account';
import { Role } from '@app/_models/role';

@Component({ standalone: false, selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
  Role = Role;
  account: Account | null = null;

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.account$.subscribe(account => this.account = account);
  }

  logout() {
    this.accountService.logout();
  }
}
