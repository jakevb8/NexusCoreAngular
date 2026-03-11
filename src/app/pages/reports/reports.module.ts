import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{ path: '', component: ReportsComponent }];

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ReportsModule {}
