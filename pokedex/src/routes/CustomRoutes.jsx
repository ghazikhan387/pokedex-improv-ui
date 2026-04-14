import { Routes, Route } from 'react-router-dom';
import Pokedex from '../components/Pokedex/Pokedex';
import PokemonEvolution from '../components/PokemonDetails/PokemonEvolution';
import PokemonDetails from '../components/PokemonDetails/PokemonDetails';
import PokemonList from '../components/PokemonList/PokemonList';

function CustomRoutes(){
 return(
    <Routes>
        <Route path="/" element ={<Pokedex/>}/>
        <Route path="/pokemon/:id" element ={<PokemonDetails/>}/>
        

    </Routes>
 );
}

export default CustomRoutes;