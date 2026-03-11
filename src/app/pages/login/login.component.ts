import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { BackendPreferenceService } from '../../services/backend-preference.service';
import { BackendChoice, BACKEND_CONFIG } from '../../models';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  BackendChoice = BackendChoice;
  BACKEND_CONFIG = BACKEND_CONFIG;
  selectedBackend: BackendChoice;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private backendPref: BackendPreferenceService,
    private router: Router,
  ) {
    this.selectedBackend = this.backendPref.get();
  }

  selectBackend(choice: BackendChoice): void {
    this.selectedBackend = choice;
    this.backendPref.set(choice);
    this.apiService.resetClient();
  }

  async signInWithGoogle(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.signInWithGoogle();
      // Auth state change drives navigation via App component
    } catch (err: any) {
      this.error = err?.message ?? 'Sign-in failed. Please try again.';
      this.loading = false;
    }
  }
}
