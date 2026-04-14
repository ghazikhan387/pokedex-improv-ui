import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PokemonEvolution.css";
import LoaderCircle from "../Loader/LoaderCircle";


function extractEvolutionTree(chain) {
  if (!chain) return null;

  return {
    name: chain.species.name,
    url: chain.species.url,
    evolves_to: chain.evolves_to.map((evo) =>
      extractEvolutionTree(evo)
    ),
  };
}


function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function EvolutionNode({ node }) {
  const [pokeData, setPokeData] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const pokemonUrl = node.url.replace(
          "pokemon-species",
          "pokemon"
        );

        const res = await axios.get(pokemonUrl);
        const data = res.data;

        setPokeData({
          name: data.name,
          image:
            data.sprites?.other?.dream_world?.front_default ||
            data.sprites.front_default,
          id: data.id,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchPokemon();
  }, [node.url]);

  if (!pokeData) {
    return <LoaderCircle />;
  }

  return (
    <div className="evolution-node">
      <div className="pokemon-card">
        <img
          src={pokeData.image}
          alt={pokeData.name}
          className="pokemon-image"
        />
        <p className="pokemon-name">
          {capitalize(pokeData.name)}
        </p>
      </div>

      {node.evolves_to.length > 0 && (<>
        <div className="evolution-arrow">→</div>

        <div className="evolution-children">
          {node.evolves_to.map((child) => (
            <EvolutionNode
              key={child.name + child.url}
              node={child}
            />
          ))}
        </div>
      </>
      )}
    </div>
  );
}

function PokemonEvolution() {
  const { id } = useParams();

  const [evolutionTree, setEvolutionTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🌐 API Call
  async function downloadEvolutionChart() {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get species using Pokémon ID
      const speciesRes = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}/`
      );

      // Step 2: Get evolution chain
      const evolutionChainUrl =
        speciesRes.data.evolution_chain.url;

      const evolutionRes = await axios.get(
        evolutionChainUrl
      );

      // Step 3: Build tree
      const tree = extractEvolutionTree(
        evolutionRes.data.chain
      );

      setEvolutionTree(tree);
    } catch (err) {
      console.error(err);
      setError("Failed to load evolution chain.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      downloadEvolutionChart();
    }
  }, [id]);

  return (
    <div className="evolution-container">
      <h1 className="evolution-title">
        Pokemon Evolution
      </h1>

      
      {loading && <LoaderCircle />}

    
      {error && <p>{error}</p>}

      {!loading && !error && evolutionTree && (
        <div className="evolution-tree">
          <EvolutionNode node={evolutionTree} />
        </div>
      )}
    </div>
  );
}

export default PokemonEvolution;