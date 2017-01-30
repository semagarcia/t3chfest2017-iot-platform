import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'angular2-highcharts';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AlertComponent } from './shared/alert.component';
import { OpenDirective } from './shared/open.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { SensorsComponent } from './sensors/sensors.component';
import { ApplicationsComponent } from './applications/applications.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    OpenDirective,
    DashboardComponent,
    SettingsComponent,
    SensorsComponent,
    ApplicationsComponent
  ],
  imports: [
    ChartModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
