import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AccountService } from '@app/_services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const account = this.accountService.accountValue;

    if (account?.jwtToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
      });
    }
    return next.handle(req);
  }
}
