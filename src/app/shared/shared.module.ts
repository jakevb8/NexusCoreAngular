import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header.component';
import { StatusChipComponent } from './components/status-chip.component';

@NgModule({
  declarations: [AppHeaderComponent, StatusChipComponent],
  imports: [CommonModule],
  exports: [AppHeaderComponent, StatusChipComponent],
})
export class SharedModule {}
