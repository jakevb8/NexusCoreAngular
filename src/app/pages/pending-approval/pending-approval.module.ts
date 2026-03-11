import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PendingApprovalComponent } from './pending-approval.component';

const routes: Routes = [{ path: '', component: PendingApprovalComponent }];

@NgModule({
  declarations: [PendingApprovalComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PendingApprovalModule {}
