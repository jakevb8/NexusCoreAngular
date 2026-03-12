export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ORG_MANAGER = 'ORG_MANAGER',
  ASSET_MANAGER = 'ASSET_MANAGER',
  VIEWER = 'VIEWER',
}

export enum OrgStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
}

export const DOTNET_BASE_URL = 'https://nexuscoredotnet-production.up.railway.app/api/v1';

export interface AuthUserOrg {
  id: string;
  status: OrgStatus;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  role: Role;
  organizationId?: string;
  organization?: AuthUserOrg;
}

export interface Asset {
  id: string;
  name: string;
  sku: string;
  description?: string;
  status: AssetStatus;
  assignedTo?: string;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedMeta {
  total?: number;
  page?: number;
  perPage?: number;
}

export interface PaginatedAssets {
  data: Asset[];
  total?: number;
  page?: number;
  perPage?: number;
  meta?: PaginatedMeta;
}

export function resolvedTotal(p: PaginatedAssets | PaginatedEvents): number {
  return p.meta?.total ?? p.total ?? 0;
}

export function resolvedPage(p: PaginatedAssets | PaginatedEvents): number {
  return p.meta?.page ?? p.page ?? 1;
}

export interface CreateAssetRequest {
  name: string;
  sku: string;
  description?: string;
  status: AssetStatus;
  assignedTo?: string;
}

export type UpdateAssetRequest = CreateAssetRequest;

export interface CsvImportResult {
  created: number;
  skipped: number;
  limitReached: boolean;
  errors: string[];
}

export interface TeamMember {
  id: string;
  email: string;
  displayName?: string;
  role: Role;
  createdAt: string;
}

export interface InviteResponse {
  inviteLink?: string;
}

export interface StatusBreakdownItem {
  status: AssetStatus;
  count: number;
}

export interface ReportsData {
  totalAssets: number;
  utilizationRate: number;
  byStatus: StatusBreakdownItem[];
}

export interface DotNetReportsResponse {
  totalAssets: number;
  utilizationRate: number;
  assetsByStatus: StatusBreakdownItem[];
}

export function dotNetToReportsData(r: DotNetReportsResponse): ReportsData {
  return {
    totalAssets: r.totalAssets,
    utilizationRate: r.utilizationRate,
    byStatus: r.assetsByStatus,
  };
}

export interface KafkaEvent {
  id: string;
  organizationId: string;
  assetId?: string;
  assetName?: string;
  previousStatus?: string;
  newStatus?: string;
  actorId?: string;
  occurredAt: string;
  createdAt: string;
}

export interface PaginatedEvents {
  data: KafkaEvent[];
  total?: number;
  page?: number;
  perPage?: number;
  meta?: PaginatedMeta;
}
