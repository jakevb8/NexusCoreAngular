import { Injectable } from '@angular/core';
import { BackendChoice, BACKEND_CONFIG } from '../models';

const STORAGE_KEY = 'nexuscore_backend_choice';

@Injectable({ providedIn: 'root' })
export class BackendPreferenceService {
  get(): BackendChoice {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === BackendChoice.DOTNET) return BackendChoice.DOTNET;
    return BackendChoice.JS;
  }

  set(choice: BackendChoice): void {
    localStorage.setItem(STORAGE_KEY, choice);
  }

  getBaseUrl(): string {
    return BACKEND_CONFIG[this.get()].baseUrl;
  }
}
