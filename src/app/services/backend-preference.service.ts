import { Injectable } from '@angular/core';
import { DOTNET_BASE_URL } from '../models';

@Injectable({ providedIn: 'root' })
export class BackendPreferenceService {
  getBaseUrl(): string {
    return DOTNET_BASE_URL;
  }
}
