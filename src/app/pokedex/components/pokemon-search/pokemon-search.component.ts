// src/app/pokedex/components/pokemon-search/pokemon-search.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf, *ngFor, etc.
import { PokemonService } from '../../../services/pokemon.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-pokemon-search',
  standalone: true, // Ensure this is present if it's a standalone component
  imports: [
    CommonModule, // Add CommonModule here
    FormsModule   // Add FormsModule here
  ],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent {
  pokemonName: string = ''; // Para el input de búsqueda (ngModel)
  pokemonData: any = null; // Para almacenar los datos del Pokémon encontrado
  errorMessage: string | null = null; // Para mensajes de error
  isLoading: boolean = false; // Para mostrar un indicador de carga

  constructor(private pokemonService: PokemonService) { }

  searchPokemon(): void {
    if (!this.pokemonName.trim()) {
      this.errorMessage = 'Por favor, ingresa un nombre de Pokémon.';
      this.pokemonData = null;
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.pokemonData = null;

    this.pokemonService.getPokemonWithEvolution(this.pokemonName.trim()).subscribe({
      next: (data) => {
        this.pokemonData = data;
        this.isLoading = false;
        console.log('Datos recibidos:', data); // Para depuración
      },
      error: (err) => {
        console.error('Error al buscar Pokémon:', err);
        this.errorMessage = `No se encontró el Pokémon "${this.pokemonName}" o ocurrió un error.`;
        this.pokemonData = null;
        this.isLoading = false;
      }
    });
  }
  
}