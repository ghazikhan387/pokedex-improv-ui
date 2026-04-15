import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

const DEFAULT_POKEMON_LIST_URL =
  "https://pokeapi.co/api/v2/pokemon";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonListUrl, setPokemonListUrl] = useState(
    DEFAULT_POKEMON_LIST_URL
  );
  const [isLoading, setIsLoading] = useState(true);
  const [previousUrl, setPreviousUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);

  useEffect(() => {
    async function downloadPokemonList() {
      setIsLoading(true);

      try {
        const response = await axios.get(pokemonListUrl);
        const pokemonResults = response.data.results;

        setPreviousUrl(response.data.previous);
        setNextUrl(response.data.next);

        const pokemonResultsPromise = pokemonResults.map(
          async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const pokemonData = pokemonResponse.data;

            return {
              id: pokemonData.id,
              name: pokemonData.name,
              image:
                pokemonData.sprites?.other?.dream_world
                  ?.front_default ||
                pokemonData.sprites?.other?.["official-artwork"]
                  ?.front_default ||
                pokemonData.sprites?.front_default,
            };
          }
        );

        const pokemonData = await Promise.all(
          pokemonResultsPromise
        );
        setPokemonList(pokemonData);
      } catch (error) {
        console.error("Failed to load pokemon list:", error);
        setPokemonList([]);
      } finally {
        setIsLoading(false);
      }
    }

    downloadPokemonList();
  }, [pokemonListUrl]);

  return (
    <div className={`pokemon-list-wrapper ${isLoading ? "loading-state" : ""}`}>
      <div className="heading">Pokemon List</div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="pokemon-wrapper">
          {pokemonList.map((pokemon) => (
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
          disabled={!previousUrl || isLoading}
          onClick={() => setPokemonListUrl(previousUrl)}
        >
          Prev
        </button>

        <button
          className="button-23"
          disabled={!nextUrl || isLoading}
          onClick={() => setPokemonListUrl(nextUrl)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;
