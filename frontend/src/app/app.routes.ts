import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pets',
    pathMatch: 'full'
  },
  {
    path: 'pets',
    loadComponent: () => import('./components/pet-list/pet-list.component')
      .then(m => m.PetListComponent),
    title: 'Lista de Mascotas'
  },
  {
    path: '**',
    redirectTo: 'pets'
  }
];
