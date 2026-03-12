import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TeamMember, Role, InviteResponse } from '../../models';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  members: TeamMember[] = [];
  loading = false;
  error = '';

  Role = Role;
  roles = Object.values(Role).filter((r) => r !== Role.SUPERADMIN);

  showInviteModal = false;
  inviteEmail = '';
  inviteRole: Role = Role.VIEWER;
  inviteLoading = false;
  inviteError = '';
  inviteResult: InviteResponse | null = null;

  get isManager(): boolean {
    const role = this.authService.appUser$.value?.role;
    return role === Role.SUPERADMIN || role === Role.ORG_MANAGER;
  }

  get currentUserId(): string {
    return this.authService.appUser$.value?.id ?? '';
  }

  constructor(private apiService: ApiService, private authService: AuthService, private location: Location, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  goBack(): void { this.location.back(); }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.members = await this.apiService.getTeam();
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Failed to load team.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  openInvite(): void {
    this.showInviteModal = true;
    this.inviteEmail = '';
    this.inviteRole = Role.VIEWER;
    this.inviteError = '';
    this.inviteResult = null;
  }

  closeInvite(): void { this.showInviteModal = false; }

  async sendInvite(): Promise<void> {
    if (!this.inviteEmail.trim()) { this.inviteError = 'Email is required.'; return; }
    this.inviteLoading = true;
    this.inviteError = '';
    try {
      this.inviteResult = await this.apiService.inviteMember(this.inviteEmail.trim(), this.inviteRole);
    } catch (err: any) {
      this.inviteError = err?.response?.data?.message ?? 'Invite failed.';
    } finally {
      this.inviteLoading = false;
    }
  }

  copyInviteLink(): void {
    if (this.inviteResult?.inviteLink) {
      navigator.clipboard.writeText(this.inviteResult.inviteLink);
    }
  }

  async removeMember(member: TeamMember): Promise<void> {
    if (!confirm(`Remove ${member.displayName || member.email}?`)) return;
    try {
      await this.apiService.removeMember(member.id);
      await this.load();
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Remove failed.';
    }
  }

  async changeRole(member: TeamMember, role: string): Promise<void> {
    try {
      await this.apiService.updateMemberRole(member.id, role as Role);
      await this.load();
    } catch (err: any) {
      this.error = err?.response?.data?.message ?? 'Role update failed.';
    }
  }
}
