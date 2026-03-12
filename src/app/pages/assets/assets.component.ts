import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {
  Asset,
  AssetStatus,
  CreateAssetRequest,
  Role,
  PaginatedAssets,
  resolvedTotal,
  resolvedPage,
  CsvImportResult,
} from '../../models';

@Component({
  selector: 'app-assets',
  standalone: false,
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  loading = false;
  error = '';
  search = '';
  page = 1;
  totalPages = 1;
  perPage = 20;
  total = 0;

  AssetStatus = AssetStatus;
  Role = Role;

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingAsset: Asset | null = null;
  form: CreateAssetRequest = { name: '', sku: '', description: '', status: AssetStatus.AVAILABLE, assignedTo: '' };
  formError = '';
  formLoading = false;

  importError = '';
  importResult: CsvImportResult | null = null;

  get isManager(): boolean {
    const role = this.authService.appUser$.value?.role;
    return role === Role.SUPERADMIN || role === Role.ORG_MANAGER || role === Role.ASSET_MANAGER;
  }

  constructor(private apiService: ApiService, private authService: AuthService, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  goBack(): void { this.location.back(); }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const res = await this.apiService.getAssets(this.page, this.search || undefined);
      this.assets = res.data;
      this.total = resolvedTotal(res);
      const p = resolvedPage(res);
      this.page = p;
      this.perPage = res.meta?.perPage ?? res.perPage ?? 20;
      this.totalPages = Math.ceil(this.total / this.perPage) || 1;
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Failed to load assets.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  onSearch(): void {
    this.page = 1;
    this.load();
  }

  prevPage(): void { if (this.page > 1) { this.page--; this.load(); } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; this.load(); } }

  openCreate(): void {
    this.modalMode = 'create';
    this.editingAsset = null;
    this.form = { name: '', sku: '', description: '', status: AssetStatus.AVAILABLE, assignedTo: '' };
    this.formError = '';
    this.showModal = true;
  }

  openEdit(asset: Asset): void {
    this.modalMode = 'edit';
    this.editingAsset = asset;
    this.form = { name: asset.name, sku: asset.sku, description: asset.description ?? '', status: asset.status, assignedTo: asset.assignedTo ?? '' };
    this.formError = '';
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  async saveAsset(): Promise<void> {
    if (!this.form.name.trim() || !this.form.sku.trim()) {
      this.formError = 'Name and SKU are required.';
      return;
    }
    this.formLoading = true;
    this.formError = '';
    try {
      const payload = { ...this.form, description: this.form.description || undefined, assignedTo: this.form.assignedTo || undefined };
      if (this.modalMode === 'create') {
        await this.apiService.createAsset(payload);
      } else {
        await this.apiService.updateAsset(this.editingAsset!.id, payload);
      }
      this.showModal = false;
      await this.load();
    } catch (err: any) {
      this.formError = err?.response?.data?.message ?? 'Save failed.';
    } finally {
      this.formLoading = false;
    }
  }

  async deleteAsset(asset: Asset): Promise<void> {
    if (!confirm(`Delete "${asset.name}"?`)) return;
    try {
      await this.apiService.deleteAsset(asset.id);
      await this.load();
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Delete failed.';
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    this.importError = '';
    this.importResult = null;
    try {
      const result = await this.apiService.importCsv(fd);
      this.importResult = result;
      await this.load();
    } catch (err: any) {
      this.importError = err?.response?.data?.message ?? 'Import failed.';
    } finally {
      input.value = '';
    }
  }

  downloadSampleCsv(): void {
    const content = this.apiService.generateSampleCsvContent();
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexuscore-assets-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  statusOptions = Object.values(AssetStatus);
}
