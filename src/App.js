import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    'https://pokeapi.co/api/v2/pokemon'
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchedPokemon, setSearchedPokemon] = useState(null);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currentPageUrl, { cancelToken: new axios.CancelToken((c) => (cancel = c)) })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPokemon(res.data.results.map((p) => p.name));
      });

    return () => cancel();
  }, [currentPageUrl]);

  useEffect(() => {
    if (searchInput === '') {
      setSearchedPokemon(null);
    } else {
      const lowercaseName = searchInput.toLowerCase(); 
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${lowercaseName}`)
        .then((res) => {
          setSearchedPokemon(res.data);
        })
        .catch((error) => {
          console.error(`Error fetching Pokémon: ${error}`);
          setSearchedPokemon(null);
        });
    }
  }, [searchInput]);
  

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  if (loading) return 'Loading...';

  return (
    <>
      <input
        type="text"
        placeholder="Search Pokémon by name"
        value={searchInput}
        onChange={handleSearchInputChange}
      />
      {searchedPokemon !== null ? (
        <div>
          <h2>{searchedPokemon.name}</h2>
          <img
            src={searchedPokemon.sprites.front_default}
            alt={searchedPokemon.name}
          />
        </div>
      ) : (
        <div>
          <PokemonList pokemon={pokemon} />
          <Pagination
            gotoNextPage={nextPageUrl ? gotoNextPage : null}
            gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
          />
        </div>
      )}
    </>
  );
}

export default App;
