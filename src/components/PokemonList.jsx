import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonList, getAllPokemon } from '../services/pokeApi';
import '../styles/PokemonList.css';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageInput, setPageInput] = useState('1');
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        const offset = currentPage * limit;
        const data = await getPokemonList(limit, offset);
        setPokemonData(data);
        
        if (searchTerm.trim() === '') {
          setDisplayedPokemon(data.results);
        }
      } catch (err) {
        setError('Failed to fetch Pokemon data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [currentPage]);

  useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      setPageInput((searchPage + 1).toString());
    }
  }, [searchPage, searchTerm]);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const data = await getAllPokemon();
        setAllPokemon(data.results);
      } catch (err) {
        console.error('Error fetching all Pokemon:', err);
      }
    };

    fetchAllPokemon();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      if (pokemonData && pokemonData.results) {
        setDisplayedPokemon(pokemonData.results);
        setSearchResults([]);
      }
    } else {
      if (allPokemon.length > 0) {
        const filtered = allPokemon.filter(pokemon => 
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setSearchResults(filtered);
        
        const startIndex = searchPage * limit;
        const endIndex = startIndex + limit;
        
        setDisplayedPokemon(filtered.slice(startIndex, endIndex));
      }
    }
  }, [searchTerm, pokemonData, allPokemon, searchPage]);

  const handlePrevious = () => {
    if (searchTerm.trim() !== '') {
      if (searchPage > 0) {
        setSearchPage(searchPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (searchTerm.trim() !== '') {
      const maxSearchPage = Math.ceil(searchResults.length / limit) - 1;
      if (searchPage < maxSearchPage) {
        setSearchPage(searchPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (pokemonData && pokemonData.next) {
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearchPage(0);
    if (e.target.value.trim() === '') {
      setPageInput((currentPage + 1).toString());
    } else {
      setPageInput('1');
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() !== '') {
      const pageNumber = parseInt(pageInput, 10);
      const maxSearchPage = Math.ceil(searchResults.length / limit);
      
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= maxSearchPage) {
        setSearchPage(pageNumber - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPageInput((searchPage + 1).toString());
      }
    } else {
      const pageNumber = parseInt(pageInput, 10);
      
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(pokemonData.count / limit)) {
        setCurrentPage(pageNumber - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPageInput((currentPage + 1).toString());
      }
    }
  };

  const getPokemonId = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  };

  if (loading && !displayedPokemon.length) return <div className="loading">Loading Pokémon...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pokemonData) return null;

  const currentPageDisplay = searchTerm.trim() !== '' ? searchPage + 1 : currentPage + 1;
  const totalPages = searchTerm.trim() !== '' 
    ? Math.ceil(searchResults.length / limit) 
    : Math.ceil(pokemonData.count / limit);
  
  const isPreviousDisabled = searchTerm.trim() !== '' ? searchPage === 0 : currentPage === 0;
  const isNextDisabled = searchTerm.trim() !== '' 
    ? searchPage >= Math.ceil(searchResults.length / limit) - 1 
    : !pokemonData.next;

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list-header">
        <h1>Pokédex</h1>
        <p>Explore the world of Pokémon! Click on a Pokémon to see detailed information.</p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      {displayedPokemon.length === 0 ? (
        <div className="no-results">No Pokémon found matching your search.</div>
      ) : (
        <div className="pokemon-grid">
          {displayedPokemon.map((pokemon) => {
            const pokemonId = getPokemonId(pokemon.url);
            return (
              <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name} className="pokemon-card">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`} 
                  alt={pokemon.name} 
                />
                <h3 className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <span className="pokemon-id">#{pokemonId}</span>
              </Link>
            );
          })}
        </div>
      )}
      
      <div className="pagination">
        <button onClick={handlePrevious} disabled={isPreviousDisabled}>
          Previous
        </button>
        
        <form onSubmit={handlePageSubmit} className="page-form">
          <span>Page</span>
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            className="page-input"
          />
          <span>of {totalPages}</span>
        </form>
        
        <button onClick={handleNext} disabled={isNextDisabled}>
          Next
        </button>
      </div>
      
      {searchTerm.trim() !== '' && searchResults.length > 0 && (
        <div className="search-info">
          Found {searchResults.length} Pokémon matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PokemonList;
