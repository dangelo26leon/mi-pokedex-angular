// src/app/services/pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

// (Opcional pero recomendado) Definir interfaces para tipar las respuestas
export interface PokemonAbilityInfo {
  ability: { name: string; url: string; };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string;
  // puedes añadir más sprites si los necesitas
}

export interface PokemonSpeciesInfo {
  evolution_chain: { url: string; };
  // ... más datos de la especie
}

export interface EvolutionChainInfo {
  chain: EvolutionLink;
}

export interface EvolutionLink {
  species: { name: string; url: string; };
  evolves_to: EvolutionLink[];
}

export interface PokemonData {
  name: string;
  sprites: PokemonSprites;
  abilities: PokemonAbilityInfo[];
  species: { url: string; }; // URL para obtener más detalles de la especie
  // ... más datos del Pokémon
}


@Injectable({
  providedIn: 'root' // Servicio disponible globalmente
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Método para obtener datos básicos de un Pokémon
  getPokemonData(pokemonNameOrId: string): Observable<PokemonData> {
    const name = pokemonNameOrId.toLowerCase(); // PokeAPI usa nombres en minúscula
    return this.http.get<PokemonData>(`${this.apiUrl}/pokemon/${name}`);
  }

  // Método para obtener datos de la especie (necesario para la cadena de evolución)
  getPokemonSpecies(speciesUrl: string): Observable<PokemonSpeciesInfo> {
    return this.http.get<PokemonSpeciesInfo>(speciesUrl);
  }

  // Método para obtener la cadena de evolución
  getEvolutionChain(evolutionChainUrl: string): Observable<EvolutionChainInfo> {
    return this.http.get<EvolutionChainInfo>(evolutionChainUrl);
  }

  // Método combinado para obtener Pokémon y su siguiente evolución
  getPokemonWithEvolution(pokemonNameOrId: string): Observable<any> {
    return this.getPokemonData(pokemonNameOrId).pipe(
      switchMap(pokemon => {
        // Una vez tenemos los datos del Pokémon, obtenemos su especie
        return this.getPokemonSpecies(pokemon.species.url).pipe(
          switchMap(species => {
            // Una vez tenemos la especie, obtenemos la cadena de evolución
            return this.getEvolutionChain(species.evolution_chain.url).pipe(
              map(evolutionChain => {
                let nextEvolutionName = 'No tiene siguiente evolución';
                if (evolutionChain.chain.evolves_to && evolutionChain.chain.evolves_to.length > 0) {
                  // Simplificamos: tomamos la primera evolución directa
                  // Si el Pokémon buscado es la base de la cadena
                  if (evolutionChain.chain.species.name === pokemon.name) {
                     nextEvolutionName = evolutionChain.chain.evolves_to[0].species.name;
                  } else {
                    // Si el Pokémon buscado es una evolución intermedia
                    const findEvolution = (link: EvolutionLink): string | null => {
                        if (link.species.name === pokemon.name && link.evolves_to.length > 0) {
                            return link.evolves_to[0].species.name;
                        }
                        for (const evolveTo of link.evolves_to) {
                            const found = findEvolution(evolveTo);
                            if (found) return found;
                        }
                        return null;
                    }
                    const foundEvo = findEvolution(evolutionChain.chain);
                    if (foundEvo) nextEvolutionName = foundEvo;
                  }
                }

                return {
                  name: pokemon.name,
                  imageUrl: pokemon.sprites.front_default,
                  abilities: pokemon.abilities.map(a => a.ability.name),
                  nextEvolution: nextEvolutionName
                };
              })
            );
          })
        );
      })
    );
  }
}