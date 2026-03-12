import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  appUser: AuthUser | null = null;

  constructor(
    private authService: AuthService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe((u) => (this.appUser = u));
  }

  goBack(): void { this.location.back(); }

  signOut(): void {
    this.authService.signOut();
  }
}
