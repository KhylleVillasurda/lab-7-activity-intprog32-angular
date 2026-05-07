import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, RouterModule],
  exports: [AlertComponent, CommonModule, RouterModule]
})
export class SharedModule {}
