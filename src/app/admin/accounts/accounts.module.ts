import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/_components/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
  declarations: [ListComponent, AddEditComponent],
  imports: [SharedModule, ReactiveFormsModule, AccountsRoutingModule]
})
export class AccountsModule {}
