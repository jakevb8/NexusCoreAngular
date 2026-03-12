import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { KafkaEvent, PaginatedEvents, resolvedTotal } from '../../models';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  events: KafkaEvent[] = [];
  loading = false;
  error = '';
  page = 1;
  totalPages = 1;
  perPage = 20;
  total = 0;

  constructor(private apiService: ApiService, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  goBack(): void { this.location.back(); }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const res = await this.apiService.getEvents(this.page);
      this.events = res.data;
      this.total = resolvedTotal(res);
      this.page = res.meta?.page ?? res.page ?? 1;
      this.perPage = res.meta?.perPage ?? res.perPage ?? 20;
      this.totalPages = Math.ceil(this.total / this.perPage) || 1;
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Failed to load events.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  prevPage(): void { if (this.page > 1) { this.page--; this.load(); } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; this.load(); } }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  }
}
