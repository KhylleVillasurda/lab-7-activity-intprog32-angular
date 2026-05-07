import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account';

@Component({ standalone: false, templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  accounts: Account[] = [];
  private deletingIds = new Set<string>();

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAll().subscribe(accounts => this.accounts = accounts);
  }

  isDeleting(id: string): boolean {
    return this.deletingIds.has(id);
  }

  deleteAccount(id: string) {
    this.deletingIds.add(id);
    this.accountService.delete(id).subscribe(() => {
      this.accounts = this.accounts.filter(a => a.id !== id);
      this.deletingIds.delete(id);
    });
  }
}
