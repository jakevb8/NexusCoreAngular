import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Prevents logged-in users from seeing login/onboarding/pending pages */
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.status$.pipe(
      filter((status) => status !== 'loading'),
      take(1),
      map((status) => {
        if (status === 'unauthenticated') return true;
        if (status === 'active') return this.router.createUrlTree(['/dashboard']);
        if (status === 'onboarding') return this.router.createUrlTree(['/onboarding']);
        if (status === 'pending') return this.router.createUrlTree(['/pending-approval']);
        return true;
      }),
    );
  }
}
