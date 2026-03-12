import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models';

interface NavCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  appUser: AuthUser | null = null;

  navCards: NavCard[] = [
    { title: 'Assets', description: 'Manage your organization\'s assets', icon: '&#128230;', route: '/assets' },
    { title: 'Team', description: 'Manage team members and roles', icon: '&#128101;', route: '/team' },
    { title: 'Reports', description: 'View utilization analytics', icon: '&#128202;', route: '/reports' },
    { title: 'Settings', description: 'Account and preferences', icon: '&#9881;', route: '/settings' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe((user) => (this.appUser = user));
  }
}
