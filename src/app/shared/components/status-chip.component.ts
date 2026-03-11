import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetStatus } from '../../models';

@Component({
  selector: 'app-status-chip',
  standalone: false,
  template: `<span class="status-chip" [ngClass]="statusClass">{{ status }}</span>`,
  styles: [`
    .status-chip {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .status-available { background: #166534; color: #bbf7d0; }
    .status-in-use    { background: #1e40af; color: #bfdbfe; }
    .status-maintenance { background: #92400e; color: #fde68a; }
    .status-retired   { background: #374151; color: #9ca3af; }
  `],
})
export class StatusChipComponent {
  @Input() status: AssetStatus | string = '';

  get statusClass(): string {
    switch (this.status) {
      case AssetStatus.AVAILABLE:   return 'status-available';
      case AssetStatus.IN_USE:      return 'status-in-use';
      case AssetStatus.MAINTENANCE: return 'status-maintenance';
      case AssetStatus.RETIRED:     return 'status-retired';
      default: return '';
    }
  }
}
