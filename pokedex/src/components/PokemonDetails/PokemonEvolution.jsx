import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PokemonEvolution.css";
import LoaderCircle from "../Loader/LoaderCircle";

// --- 1. Helper Functions ---
function extractEvolutionTree(chain) {
  if (!chain) return null;
  return {
    name: chain.species.name,
    url: chain.species.url,
    evolves_to: chain.evolves_to.map(extractEvolutionTree),
  };
}

// --- 2. Custom Hooks for API Calls ---
function useEvolutionTree(identifier) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!identifier) return;

    async function fetchTree() {
      setLoading(true);
      setError(null);
      try {
        // ✅ Uses the identifier (name or id) to fetch the evolution chain
        const { data: species } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${identifier}/`);
        const { data: evolution } = await axios.get(species.evolution_chain.url);
        setTree(extractEvolutionTree(evolution.chain));
      } catch (err) {
        console.error(err);
        setError("Failed to load evolution chain.");
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [identifier]);

  return { tree, loading, error };
}

function usePokemonData(url) {
  const [pokeData, setPokeData] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const pokemonUrl = url.replace("pokemon-species", "pokemon");
        const { data } = await axios.get(pokemonUrl);
        setPokeData({
          name: data.name,
          image: data.sprites?.other?.dream_world?.front_default || data.sprites.front_default,
          id: data.id,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchPokemon();
  }, [url]);

  return pokeData;
}

function EvolutionNode({ node, currentId }) {
  const pokeData = usePokemonData(node.url);

  if (!pokeData) return <LoaderCircle />;

  
  const isCurrentPokemon = 
    pokeData.name === currentId || pokeData.id.toString() === currentId;

  return (
    <div className="evolution-node">
    
      <div className={`pokemon-card ${isCurrentPokemon ? "active-card" : ""}`}>
        <img src={pokeData.image} alt={pokeData.name} className="pokemon-image" />
        <p className="pokemon-name">{pokeData.name}</p>
      </div>

      {node.evolves_to.length > 0 && (
        <>
          <div className="evolution-arrow">→</div>
          <div className="evolution-children">
            {node.evolves_to.map((child) => (
              <EvolutionNode 
                key={child.name} 
                node={child} 
                currentId={currentId} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export default function PokemonEvolution({ pokemonName }) {
  const { id } = useParams(); 
  
 
  const identifier = pokemonName || id; 
  
  const { tree, loading, error } = useEvolutionTree(identifier);

  return (
    <div className="evolution-container">
      <h1 className="evolution-title">Pokemon Evolution</h1>

      {loading && <LoaderCircle />}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && tree && (
        <div className="evolution-tree">
         
          <EvolutionNode node={tree} currentId={identifier} />
        </div>
      )}
    </div>
  );
}