import PokemonList from '../PokemonList/PokemonList';
import Search from '../Search/Search';
import {useEffect, useState} from 'react';
import './Pokedex.css';
import PokemonDetails from '../PokemonDetails/PokemonDetails';

function Pokedex(){

    const [searchTerm, setSearchTerm] = useState("");


    return(
        <div className='pokedex-wrapper'>
            <h1 id='pokedex-heading'>Pokédex</h1>
            <Search updateSearchTerm={setSearchTerm} />

            {(!searchTerm.length) ? <PokemonList />:<PokemonDetails key={searchTerm} pokemonName={searchTerm} onClearSearch={() => setSearchTerm("")}/>}
        </div>
    )
}

export default Pokedex