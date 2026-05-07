import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;

    if (!account) {
      this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const roles = route.data['roles'] as string[];
    if (roles && !roles.includes(account.role)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
