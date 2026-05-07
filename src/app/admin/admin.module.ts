import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/_components/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { SubNavComponent } from './subnav.component';

@NgModule({
  declarations: [LayoutComponent, OverviewComponent, SubNavComponent],
  imports: [SharedModule, ReactiveFormsModule, AdminRoutingModule]
})
export class AdminModule {}
