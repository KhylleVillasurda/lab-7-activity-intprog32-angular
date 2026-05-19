import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },

  // Safety redirect: the old backend incorrectly generated email links pointing
  // to /accounts/* (with an 's'). Any user who received one of those old emails
  // and clicks the link will now be redirected to the correct /account/* path,
  // preserving the ?token= query string.
  { path: 'accounts/verify-email',    redirectTo: 'account/verify-email' },
  { path: 'accounts/reset-password',  redirectTo: 'account/reset-password' },

  // Wildcard must stay last
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
