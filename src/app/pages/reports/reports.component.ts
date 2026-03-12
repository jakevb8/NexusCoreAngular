import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ReportsData, AssetStatus } from '../../models';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  data: ReportsData | null = null;
  loading = false;
  error = '';

  chartLabels: string[] = [];
  chartData: number[] = [];
  chartColors: string[] = [];

  private statusColors: Record<string, string> = {
    [AssetStatus.AVAILABLE]:   '#22c55e',
    [AssetStatus.IN_USE]:      '#3b82f6',
    [AssetStatus.MAINTENANCE]: '#f59e0b',
    [AssetStatus.RETIRED]:     '#6b7280',
  };

  constructor(private apiService: ApiService, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  goBack(): void { this.location.back(); }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.data = await this.apiService.getReports();
      this.chartLabels = this.data.byStatus.map((s) => s.status);
      this.chartData = this.data.byStatus.map((s) => s.count);
      this.chartColors = this.data.byStatus.map((s) => this.statusColors[s.status] ?? '#6b7280');
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Failed to load reports.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  get utilizationPercent(): number {
    return Math.round(this.data?.utilizationRate ?? 0);
  }
}
