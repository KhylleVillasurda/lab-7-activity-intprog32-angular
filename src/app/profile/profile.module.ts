import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/_components/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { UpdateComponent } from './update.component';

@NgModule({
  declarations: [LayoutComponent, UpdateComponent],
  imports: [SharedModule, ReactiveFormsModule, ProfileRoutingModule]
})
export class ProfileModule {}
