import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import PokemonEvolution from "./PokemonEvolution";

function PokemonDetails(){

    const { id } = useParams();
    const [pokemon, setPokemon] = useState({});

    async function downloadPokemon(){
       const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
       console.log(response.data);
         setPokemon({
            name: response.data.name,
            image: response.data.sprites.other.dream_world.front_default, 
            types: response.data.types.map((type) => type.type.name),
            height: response.data.height,
            weight: response.data.weight,
            stats: response.data.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
            abilities: response.data.abilities.map((ability) => ability.ability.name),
        });
    }

    useEffect(()=> {
        downloadPokemon();
        console.log(pokemon);
    },[])



    return(
         <>
         
         <div className="pokemon-details-wrapper">

            <div className="left-column">
                <div className="pokemon-title">{pokemon.name}</div>
                <div className="pokemon-image-wrapper">
                    <img className="pokemon-image" src={pokemon.image} alt={pokemon.name} />
                </div>    
            </div>

            <div className="right-column">
                 <div className="classification-specs">
                    <div className="types">{pokemon.types?.map((type)=> <span key={type}>{type}</span>)}</div>
                    <div className="height-weight"></div>
               </div>
             <div className="base-stats"></div>
               <div className="abilities"></div>

            </div>
        </div>
        <PokemonEvolution />

        
        </>
    )
}

export default PokemonDetails;
