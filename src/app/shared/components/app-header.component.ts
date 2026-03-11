import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <header class="app-header">
      <div class="header-left">
        <button *ngIf="showBack" class="btn-icon" (click)="onBack.emit()">
          <span class="icon">&#8592;</span>
        </button>
        <h1 class="header-title">{{ title }}</h1>
      </div>
      <div class="header-right">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: #1a1a2e;
      border-bottom: 1px solid #2d2d44;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-icon {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1.1rem;
    }
    .btn-icon:hover { color: #e2e8f0; }
  `],
})
export class AppHeaderComponent {
  @Input() title = '';
  @Input() showBack = false;
  @Output() onBack = new EventEmitter<void>();
}
