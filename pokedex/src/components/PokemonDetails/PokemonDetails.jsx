import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import PokemonEvolution from "./PokemonEvolution";
import "./PokemonDetails.css";
import PokemonStats from "./PokemonStats";
import { GiWeight, GiBodyHeight } from "react-icons/gi";
import { FaArrowRightFromBracket } from "react-icons/fa6";


function PokemonDetails({ pokemonName, onClearSearch }) {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({});

  async function downloadPokemon() {
    
    const identifier = pokemonName || id;
    
   
    if (!identifier) return;

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`);
      
      setPokemon({
        name: response.data.name,
        image: response.data.sprites.other.dream_world.front_default || response.data.sprites.front_default,
        types: response.data.types.map((type) => type.type.name),
        height: response.data.height,
        weight: response.data.weight,
        stats: response.data.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
        abilities: response.data.abilities.map((ability) => ability.ability.name),
      });
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
    }
  }

  useEffect(() => {
    downloadPokemon();
  }, [id, pokemonName]); 

  return (
    <>
     
      {pokemonName ? (
        <div className="go-back-button" onClick={onClearSearch} style={{ cursor: "pointer" }}>
          <FaArrowRightFromBracket style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />
          Go Back
        </div>
      ) : (
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="go-back-button">
            <FaArrowRightFromBracket style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />
            Go Back
          </div>
        </Link>
      )}

      <div className="pokemon-details-wrapper">

        <div className="left-column">
          <div className="pokemon-image-and-name-card">
            <div className="pokemon-title">{pokemon.name}</div>
            <div className="pokemon-image-wrapper">
              {/* Optional chaining just in case image hasn't loaded yet */}
              {pokemon.image && <img className="pokemon-image-main" src={pokemon.image} alt={pokemon.name} />}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="classification-specs">
            <div className="types">
              <div className="types-wrapper">
                <div className="types-title">Classification:</div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {pokemon.types?.map((type) => <span key={type} className={`type-badge ${type}`}>{type}</span>)}
                </div>
              </div>
            </div>
            <div className="height-weight">
              <div className="height-weight-wrapper">
                <div className="height">
                  <div>Height:</div>
                  <div><GiBodyHeight size={20} /></div>
                  <div>{pokemon.height}</div>
                </div>
                <div className="weight">
                  <div>Weight:</div>
                  <div><GiWeight size={20} /></div>
                  <div>{pokemon.weight}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="base-stats">
           
            {pokemon.stats && <PokemonStats stats={pokemon.stats} />}
          </div>

          <div className="abilities">
            <span className="abilities-title">Abilities:</span> {pokemon.abilities?.map((ability) => <span className="abilities-value" key={ability}>{ability}</span>)}
          </div>
        </div>

      </div>

      
      <PokemonEvolution pokemonName={pokemonName} />
    </>
  );
}

export default PokemonDetails;