import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { AuthUser, OrgStatus } from '../models';

export type AppAuthStatus = 'loading' | 'unauthenticated' | 'onboarding' | 'pending' | 'active';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private firebaseApp = initializeApp(environment.firebase);
  readonly auth: Auth = getAuth(this.firebaseApp);

  readonly firebaseUser$ = new BehaviorSubject<User | null>(null);
  readonly appUser$ = new BehaviorSubject<AuthUser | null>(null);
  readonly status$ = new BehaviorSubject<AppAuthStatus>('loading');

  private unsubscribeAuth: (() => void) | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.apiService.setAuth(this.auth);
    this.unsubscribeAuth = onAuthStateChanged(this.auth, async (user) => {
      this.firebaseUser$.next(user);
      if (!user) {
        this.appUser$.next(null);
        this.status$.next('unauthenticated');
        return;
      }
      await this.loadAppUser();
    });
  }

  async loadAppUser(): Promise<void> {
    try {
      const appUser = await this.apiService.getMe();
      this.appUser$.next(appUser);
      if (!appUser.organizationId) {
        this.status$.next('onboarding');
      } else if (appUser.organization?.status === OrgStatus.PENDING) {
        this.status$.next('pending');
      } else {
        this.status$.next('active');
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        this.status$.next('onboarding');
      } else {
        this.appUser$.next(null);
        this.status$.next('unauthenticated');
      }
    }
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    this.apiService.resetClient();
    this.appUser$.next(null);
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }
}
