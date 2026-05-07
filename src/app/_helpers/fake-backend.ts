import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '@app/_models/role';

// Stored in localStorage
const accountsKey = 'angular-jwt-refresh-token-accounts';
let accounts: any[] = JSON.parse(localStorage.getItem(accountsKey)!) || [];

@Injectable()
class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/accounts/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/accounts/refresh-token') && method === 'POST':
          return refreshToken();
        case url.endsWith('/accounts/revoke-token') && method === 'POST':
          return revokeToken();
        case url.endsWith('/accounts/register') && method === 'POST':
          return register();
        case url.endsWith('/accounts/verify-email') && method === 'POST':
          return verifyEmail();
        case url.endsWith('/accounts/forgot-password') && method === 'POST':
          return forgotPassword();
        case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
          return validateResetToken();
        case url.endsWith('/accounts/reset-password') && method === 'POST':
          return resetPassword();
        case url.endsWith('/accounts') && method === 'GET':
          return getAccounts();
        case url.match(/\/accounts\/\d+$/) && method === 'GET':
          return getAccountById();
        case url.endsWith('/accounts') && method === 'POST':
          return createAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'PUT':
          return updateAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
          return deleteAccount();
        default:
          return next.handle(request);
      }
    }

    function authenticate() {
      const { email, password } = body;
      const account = accounts.find(a => a.email === email && a.password === password && a.isVerified);
      if (!account) return error('Email or password is incorrect');
      account.refreshTokens = account.refreshTokens || [];
      account.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ ...basicDetails(account), jwtToken: generateJwtToken(account) });
    }

    function refreshToken() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return unauthorized();
      const account = accounts.find(a => a.refreshTokens?.includes(refreshToken));
      if (!account) return unauthorized();
      account.refreshTokens = account.refreshTokens.filter((t: string) => t !== refreshToken);
      account.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ ...basicDetails(account), jwtToken: generateJwtToken(account) });
    }

    function revokeToken() {
      const refreshToken = getRefreshToken();
      const account = accounts.find(a => a.refreshTokens?.includes(refreshToken));
      if (account) {
        account.refreshTokens = account.refreshTokens.filter((t: string) => t !== refreshToken);
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
      }
      return ok({});
    }

    function register() {
      const account = body;
      if (accounts.find(a => a.email === account.email)) {
        return error(`Email "${account.email}" is already registered`);
      }
      account.id = newAccountId();
      account.role = accounts.length === 0 ? Role.Admin : Role.User;
      account.isVerified = true; // auto-verify in fake backend
      account.refreshTokens = [];
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ message: 'Registration successful. Please check your email for verification instructions.' });
    }

    function verifyEmail() {
      const { token } = body;
      const account = accounts.find(a => a.verificationToken === token);
      if (!account) {
        // In fake backend, auto-verify works without token
        return ok({ message: 'Verification successful' });
      }
      account.isVerified = true;
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ message: 'Verification successful' });
    }

    function forgotPassword() {
      const { email } = body;
      const account = accounts.find(a => a.email === email);
      if (!account) return ok({ message: 'If that email address is in our database, you will receive a password recovery link.' });
      account.resetToken = 'fake-reset-token';
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ message: 'Please check your email for password reset instructions.' });
    }

    function validateResetToken() {
      const { token } = body;
      const account = accounts.find(a => a.resetToken === token);
      if (!account) return error('Invalid token');
      return ok({ message: 'Token is valid' });
    }

    function resetPassword() {
      const { token, password } = body;
      const account = accounts.find(a => a.resetToken === token);
      if (!account) return error('Invalid token');
      account.password = password;
      delete account.resetToken;
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ message: 'Password reset successful' });
    }

    function getAccounts() {
      if (!isAuthorized(Role.Admin)) return unauthorized();
      return ok(accounts.map(a => basicDetails(a)));
    }

    function getAccountById() {
      if (!isLoggedIn()) return unauthorized();
      const account = accounts.find(a => a.id === idFromUrl());
      if (account?.id !== currentAccount()?.id && !isAuthorized(Role.Admin)) return unauthorized();
      return ok(basicDetails(account));
    }

    function createAccount() {
      if (!isAuthorized(Role.Admin)) return unauthorized();
      const account = body;
      if (accounts.find(a => a.email === account.email)) {
        return error(`Email "${account.email}" is already registered`);
      }
      account.id = newAccountId();
      account.isVerified = true;
      account.refreshTokens = [];
      accounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok(basicDetails(account));
    }

    function updateAccount() {
      if (!isLoggedIn()) return unauthorized();
      const params = body;
      const account = accounts.find(a => a.id === idFromUrl());
      if (account?.id !== currentAccount()?.id && !isAuthorized(Role.Admin)) return unauthorized();
      if (params.password) account.password = params.password;
      Object.assign(account, params);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok(basicDetails(account));
    }

    function deleteAccount() {
      if (!isLoggedIn()) return unauthorized();
      const account = accounts.find(a => a.id === idFromUrl());
      if (account?.id !== currentAccount()?.id && !isAuthorized(Role.Admin)) return unauthorized();
      accounts = accounts.filter(a => a.id !== idFromUrl());
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok({ message: 'Account deleted successfully' });
    }

    // Helpers
    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } })).pipe(materialize(), delay(500), dematerialize());
    }

    function unauthorized() {
      return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })).pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization');
      return authHeader?.startsWith('Bearer fake-jwt-token') ?? false;
    }

    function isAuthorized(role: Role) {
      const account = currentAccount();
      return isLoggedIn() && account?.role === role;
    }

    function currentAccount() {
      const authHeader = headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer fake-jwt-token')) return null;
      const id = parseInt(authHeader.replace('Bearer fake-jwt-token.', ''));
      return accounts.find(a => a.id === id);
    }

    function idFromUrl() {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1]);
    }

    function newAccountId() {
      return accounts.length ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    }

    function getRefreshToken() {
      // In real app this would come from an HttpOnly cookie; fake it with headers
      return 'fake-refresh-token';
    }

    function generateJwtToken(account: any) {
      const tokenPayload = { exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000), id: account.id };
      return `fake-jwt-token.${account.id}`;
    }

    function generateRefreshToken() {
      const token = new Date().getTime().toString();
      return token;
    }

    function basicDetails(account: any) {
      const { id, title, firstName, lastName, email, role } = account;
      return { id, title, firstName, lastName, email, role };
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
