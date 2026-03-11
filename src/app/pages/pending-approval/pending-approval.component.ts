import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pending-approval',
  standalone: false,
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="icon">&#9203;</div>
        <h1>Pending Approval</h1>
        <p>Your organization is awaiting approval. You'll be notified once access is granted.</p>
        <button class="btn-ghost" (click)="signOut()">Sign out</button>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f0f23;
      padding: 1rem;
    }
    .auth-card {
      background: #1a1a2e;
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .icon { font-size: 3rem; }
    h1 { margin: 0; color: #e2e8f0; font-size: 1.5rem; }
    p { margin: 0; color: #94a3b8; line-height: 1.5; }
    .btn-ghost {
      background: none;
      border: 1px solid #2d2d44;
      color: #94a3b8;
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      &:hover { border-color: #4b5563; color: #e2e8f0; }
    }
  `],
})
export class PendingApprovalComponent {
  constructor(private authService: AuthService) {}
  signOut(): void { this.authService.signOut(); }
}
