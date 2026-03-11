import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { BackendPreferenceService } from './services/backend-preference.service';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    AuthService,
    ApiService,
    BackendPreferenceService,
  ],
  bootstrap: [App],
})
export class AppModule {}
