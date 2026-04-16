import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

const DEFAULT_POKEMON_LIST_URL = "https://pokeapi.co/api/v2/pokemon";

function PokemonList() {  
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    pokemonListUrl: DEFAULT_POKEMON_LIST_URL,
    previousUrl: null,
    nextUrl: null,
    isLoading: true,
  });

  useEffect(() => {
    async function downloadPokemonList() {
      setPokemonListState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await axios.get(pokemonListState.pokemonListUrl);
        const pokemonResults = response.data.results;

        setPokemonListState((prev) => ({
          ...prev,
          previousUrl: response.data.previous,
          nextUrl: response.data.next,
        }));

        const pokemonResultsPromise = pokemonResults.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          const pokemonData = pokemonResponse.data;

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image:
              pokemonData.sprites?.other?.dream_world?.front_default ||
              pokemonData.sprites?.other?.["official-artwork"]?.front_default ||
              pokemonData.sprites?.front_default,
          };
        });

        const pokemonData = await Promise.all(pokemonResultsPromise);
        setPokemonListState((prev) => ({ ...prev, pokemonList: pokemonData })); 
      } catch (error) {
        console.error("Failed to load pokemon list:", error);
        setPokemonListState((prev) => ({ ...prev, pokemonList: [] }));
        alert("Failed to load pokemon list. Please try again later.");
      } finally {
        setPokemonListState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    downloadPokemonList();
  }, [pokemonListState.pokemonListUrl]);

  return (
    <div className={`pokemon-list-wrapper ${pokemonListState.isLoading ? "loading-state" : ""}`}>
      <div className="heading">Pokemon List</div>

      {pokemonListState.isLoading ? (
        <Loader />
      ) : (
        <div className="pokemon-wrapper">
          {pokemonListState.pokemonList.map((pokemon) => (
            <Pokemon
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              id={pokemon.id}
            />
          ))}
        </div>
      )}

      <div className="controls">
        <button
          className="button-23"
          disabled={!pokemonListState.previousUrl || pokemonListState.isLoading}
          onClick={() =>
            setPokemonListState((prev) => ({ ...prev, pokemonListUrl: prev.previousUrl }))
          }
        >
          Prev
        </button>

        <button
          className="button-23"
          disabled={!pokemonListState.nextUrl || pokemonListState.isLoading}
          onClick={() =>
            setPokemonListState((prev) => ({ ...prev, pokemonListUrl: prev.nextUrl }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;