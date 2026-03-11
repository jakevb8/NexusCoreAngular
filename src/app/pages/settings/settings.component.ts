import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { BackendPreferenceService } from '../../services/backend-preference.service';
import { AuthUser, BackendChoice, BACKEND_CONFIG } from '../../models';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  appUser: AuthUser | null = null;
  selectedBackend: BackendChoice;
  BackendChoice = BackendChoice;
  BACKEND_CONFIG = BACKEND_CONFIG;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private backendPref: BackendPreferenceService,
    private location: Location,
  ) {
    this.selectedBackend = this.backendPref.get();
  }

  ngOnInit(): void {
    this.authService.appUser$.subscribe((u) => (this.appUser = u));
  }

  goBack(): void { this.location.back(); }

  switchBackend(choice: BackendChoice): void {
    this.selectedBackend = choice;
    this.backendPref.set(choice);
    this.apiService.resetClient();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
