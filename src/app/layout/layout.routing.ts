import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'landing',
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
    ],
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
