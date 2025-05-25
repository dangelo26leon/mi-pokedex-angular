// src/app/pokedex/pokedex.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { PokedexRoutingModule } from './pokedex-routing.module';
import { PokemonSearchComponent } from './components/pokemon-search/pokemon-search.component';

@NgModule({
  declarations: [
    // Los componentes standalone no se declaran aquí
  ],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    FormsModule, // FormsModule para ngModel
    PokemonSearchComponent // Importar el componente standalone
  ]
})
export class PokedexModule { }