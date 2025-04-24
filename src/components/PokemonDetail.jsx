import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemonDetails } from '../services/pokeApi';
import '../styles/PokemonDetail.css';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const data = await getPokemonDetails(name);
        setPokemon(data);
      } catch (err) {
        setError('Failed to fetch Pokemon details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (loading) return <div className="loading">Loading Pokémon details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pokemon) return null;

  return (
    <div className="pokemon-detail-container">
      <Link to="/" className="back-button">Back to Pokédex</Link>
      
      <div className="pokemon-detail-card">
        <div className="pokemon-header">
          <h1>{pokemon.name}</h1>
          <span className="pokemon-id">#{pokemon.id}</span>
        </div>
        
        <div className="pokemon-images">
          {pokemon.sprites.front_default && (
            <img 
              src={pokemon.sprites.front_default} 
              alt={`${pokemon.name} front view`} 
              className="pokemon-sprite"
            />
          )}
          {pokemon.sprites.back_default && (
            <img 
              src={pokemon.sprites.back_default} 
              alt={`${pokemon.name} back view`} 
              className="pokemon-sprite"
            />
          )}
        </div>
        
        <div className="pokemon-types">
          <h3>Types</h3>
          <div className="type-badges">
            {pokemon.types.map(typeInfo => (
              <span 
                key={typeInfo.type.name} 
                className={`type-badge ${typeInfo.type.name}`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="pokemon-info">
          <div className="info-item">
            <h3>Height</h3>
            <p>{pokemon.height / 10} m</p>
          </div>
          <div className="info-item">
            <h3>Weight</h3>
            <p>{pokemon.weight / 10} kg</p>
          </div>
          <div className="info-item">
            <h3>Base Experience</h3>
            <p>{pokemon.base_experience}</p>
          </div>
        </div>
        
        <div className="pokemon-abilities">
          <h3>Abilities</h3>
          <ul>
            {pokemon.abilities.map(abilityInfo => (
              <li key={abilityInfo.ability.name}>
                {abilityInfo.ability.name.replace(/-/g, ' ')}
                {abilityInfo.is_hidden && <span className="hidden-ability">Hidden</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pokemon-stats">
          <h3>Stats</h3>
          <div className="stats-container">
            {pokemon.stats.map(statInfo => (
              <div key={statInfo.stat.name} className="stat-item">
                <span className="stat-name">{statInfo.stat.name.replace(/-/g, ' ')}</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar" 
                    style={{ width: `${(statInfo.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
                <span className="stat-value">{statInfo.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
