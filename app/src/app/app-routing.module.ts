import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SensorsComponent } from './sensors/sensors.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sensors', component: SensorsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '**', redirectTo: '/dashboard' }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
