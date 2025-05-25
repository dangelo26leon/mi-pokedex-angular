// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Redirección de la ruta raíz a /home
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  
  // Rutas lazy-loaded generadas por el CLI
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) }, 
  { path: 'pokedex', loadChildren: () => import('./pokedex/pokedex.module').then(m => m.PokedexModule) },

  // Wildcard route para rutas no encontradas (opcional, redirige a home)
  { path: '**', redirectTo: '/home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }