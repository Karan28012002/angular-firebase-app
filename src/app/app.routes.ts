import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'landing' }, // Wildcard route for 404
];
