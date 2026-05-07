import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account';
import { Role } from '@app/_models/role';

@Component({ standalone: false, templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  account!: Account;
  Role = Role;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.account = this.accountService.accountValue!;
  }
}
