const pokemons = require('../data/pokemons');
const favorites = require('../data/favorites');

module.exports = {
  helloWorld(request, reply) {
    reply('Hello world!');
  },

  getAllPokemons(request, reply) {
    const data = require('./../data/pokemons.json');

    if (request.query && request.query.fields === 'name') {
      return reply(data.map((pokemon) => {
        return {
          name: pokemon.name
        };
      }));
    }
    reply(data);
  },

  createPokemon(request, reply) {
    pokemons.push(request.payload);
    reply().code(201);
  },

  saveFavorite(request, reply) {
    favorites.push(request.payload);
    reply().code(201);
  },

  getFavorites(request, reply) {
    const data = require('../data/favorites');
    reply(data);
  }
};
