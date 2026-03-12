import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: false,
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  displayName = '';
  organizationName = '';
  loading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {
    const fbUser = this.authService.firebaseUser$.value;
    if (fbUser?.displayName) this.displayName = fbUser.displayName;
  }

  async submit(): Promise<void> {
    if (!this.displayName.trim() || !this.organizationName.trim()) {
      this.error = 'Display name and organization name are required.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.apiService.register({
        displayName: this.displayName.trim(),
        organizationName: this.organizationName.trim(),
      });
      await this.authService.loadAppUser();
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? err?.message ?? 'Registration failed.';
      this.loading = false;
    }
  }

  signOut(): void {
    this.authService.signOut();
  }
}
