import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Auth } from 'firebase/auth';
import { BackendPreferenceService } from './backend-preference.service';
import {
  AuthUser,
  Asset,
  PaginatedAssets,
  CreateAssetRequest,
  UpdateAssetRequest,
  CsvImportResult,
  TeamMember,
  InviteResponse,
  ReportsData,
  DotNetReportsResponse,
  JsReportsResponse,
  dotNetToReportsData,
  jsToReportsData,
  Role,
  BackendChoice,
  PaginatedEvents,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private _client: AxiosInstance | null = null;
  private _auth: Auth | null = null;

  constructor(private backendPref: BackendPreferenceService) {}

  setAuth(auth: Auth): void {
    this._auth = auth;
  }

  private getClient(): AxiosInstance {
    if (!this._client) {
      this._client = axios.create({ baseURL: this.backendPref.getBaseUrl() });
      this._client.interceptors.request.use(async (config) => {
        if (this._auth?.currentUser) {
          const token = await this._auth.currentUser.getIdToken(false);
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      });
    }
    return this._client;
  }

  resetClient(): void {
    this._client = null;
  }

  // Auth
  async getMe(): Promise<AuthUser> {
    const res = await this.getClient().get<AuthUser>('/auth/me');
    return res.data;
  }

  async register(payload: {
    organizationName: string;
    organizationSlug: string;
    displayName?: string;
  }): Promise<void> {
    await this.getClient().post('/auth/register', payload);
  }

  async deleteAccount(): Promise<void> {
    await this.getClient().delete('/auth/me');
  }

  // Assets
  async getAssets(page = 1, search?: string): Promise<PaginatedAssets> {
    const res = await this.getClient().get<PaginatedAssets>('/assets', {
      params: { page, ...(search ? { search } : {}) },
    });
    return res.data;
  }

  async createAsset(data: CreateAssetRequest): Promise<Asset> {
    const res = await this.getClient().post<Asset>('/assets', data);
    return res.data;
  }

  async updateAsset(id: string, data: UpdateAssetRequest): Promise<Asset> {
    const res = await this.getClient().put<Asset>(`/assets/${id}`, data);
    return res.data;
  }

  async deleteAsset(id: string): Promise<void> {
    await this.getClient().delete(`/assets/${id}`);
  }

  async importCsv(formData: FormData): Promise<CsvImportResult> {
    const res = await this.getClient().post<CsvImportResult>('/assets/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  generateSampleCsvContent(): string {
    return (
      'Name,SKU,Description,Status\n' +
      'Laptop,LAP-001,MacBook Pro 14,AVAILABLE\n' +
      'Monitor,MON-001,Dell 27" 4K,IN_USE\n'
    );
  }

  // Team
  async getTeam(): Promise<TeamMember[]> {
    const res = await this.getClient().get<TeamMember[]>('/users');
    return res.data;
  }

  async inviteMember(email: string, role: Role): Promise<InviteResponse> {
    const res = await this.getClient().post<InviteResponse>('/users/invite', { email, role });
    return res.data;
  }

  async removeMember(id: string): Promise<void> {
    await this.getClient().delete(`/users/${id}`);
  }

  async updateMemberRole(id: string, role: Role): Promise<TeamMember> {
    const res = await this.getClient().patch<TeamMember>(`/users/${id}/role`, { role });
    return res.data;
  }

  // Reports
  async getReports(): Promise<ReportsData> {
    const choice = this.backendPref.get();
    if (choice === BackendChoice.JS) {
      const res = await this.getClient().get<JsReportsResponse>('/reports/stats');
      return jsToReportsData(res.data);
    } else {
      const res = await this.getClient().get<DotNetReportsResponse>('/reports');
      return dotNetToReportsData(res.data);
    }
  }

  // Events
  async getEvents(page = 1): Promise<PaginatedEvents> {
    const res = await this.getClient().get<PaginatedEvents>('/events', {
      params: { page },
    });
    return res.data;
  }
}
