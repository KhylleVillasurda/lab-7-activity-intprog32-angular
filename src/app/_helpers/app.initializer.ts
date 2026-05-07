import { AccountService } from '@app/_services/account.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Runs before app starts — restores session from refresh token cookie if it exists
export function appInitializer(accountService: AccountService) {
  return () => accountService.refreshToken().pipe(catchError(() => of(null)));
}
