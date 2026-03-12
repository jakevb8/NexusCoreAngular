import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { AuthUser } from '../../models';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  appUser: AuthUser | null = null;
  deleteError = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe((u) => (this.appUser = u));
  }

  goBack(): void { this.location.back(); }

  signOut(): void {
    this.authService.signOut();
  }

  async deleteAccount(): Promise<void> {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return;
    this.deleteError = '';
    try {
      await this.apiService.deleteAccount();
      await this.authService.signOut();
    } catch (err: any) {
      this.deleteError = err?.response?.data?.message ?? 'Failed to delete account.';
    }
  }
}
