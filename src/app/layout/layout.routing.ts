import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./content/content.component').then((m) => m.ContentComponent),
      },
      {
        path: 'Admin',
        loadComponent: () =>
          import('./admin-panel/admin-panel.component').then(
            (m) => m.AdminPanelComponent
          ),
      },
      {
        path: 'profile-settings',
        loadComponent: () =>
          import('./profile-settings/profile-settings.component').then(
            (m) => m.ProfileSettingsComponent
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./support/support.component').then((m) => m.SupportComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./help/help.component').then((m) => m.HelpComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
