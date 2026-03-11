import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';

const routes: Routes = [{ path: '', component: OnboardingComponent }];

@NgModule({
  declarations: [OnboardingComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class OnboardingModule {}
