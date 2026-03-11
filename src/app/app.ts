import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AppAuthStatus } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.status$.subscribe((status: AppAuthStatus) => {
      if (status === 'loading') return;
      const url = this.router.url;
      if (status === 'active' && (url === '/' || url === '/login')) {
        this.router.navigate(['/dashboard']);
      } else if (status === 'onboarding' && url !== '/onboarding') {
        this.router.navigate(['/onboarding']);
      } else if (status === 'pending' && url !== '/pending-approval') {
        this.router.navigate(['/pending-approval']);
      } else if (status === 'unauthenticated' && url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}
