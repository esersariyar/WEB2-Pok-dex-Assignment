const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export const getAllPokemon = async (limit = 1000) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=0`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    throw error;
  }
};

export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for Pokemon ${nameOrId}:`, error);
    throw error;
  }
};
