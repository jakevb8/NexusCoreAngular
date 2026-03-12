import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

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
