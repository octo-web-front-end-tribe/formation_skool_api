const handlers = require('./handlers');
const Joi = require('joi');

module.exports = [
  {
    method : 'GET',
    path : '/',
    config : {
      handler : handlers.helloWorld,
      tags : ['api'],
      validate: {
        query: {
          api_key: Joi.string()
        }
      }
    }
  },
  {
    method : 'GET',
    path : '/pokemons',
    config : {
      handler : handlers.getAllPokemons,
      tags : ['api'],
      validate : {
        query : {
          api_key : Joi.string(),
          fields : Joi.string(),
        }
      },
      response : {
        schema : Joi.array().label('Pokemons').items(
          Joi.object({
            name : Joi.string().example('Pikachu'),
            type : Joi.string().example('Electrik')
          }).label('Pokemon')
        )
      }
    }
  },
  {
    method : 'POST',
    path : '/pokemons',
    config : {
      handler : handlers.createPokemon,
      tags : ['api'],
      validate : {
        query : Joi.object({
          api_key : Joi.string()
        }),
        payload : Joi.object({
          name : Joi.string().required()
        })
      }
    }
  },
  {
    method : 'POST',
    path : '/favorites',
    config : {
      handler : handlers.saveFavorite,
      tags : ['api'],
      validate : {
        query : Joi.object({
          api_key : Joi.string()
        }),
        payload : Joi.object({
          label : Joi.string().required(),
          color : Joi.string().regex(/^#([A-F0-9]{6})$/).required()
        })
      }
    }
  },
  {
    method : 'GET',
    path : '/favorites',
    config : {
      handler : handlers.getFavorites,
      tags : ['api'],
      validate : {
        query : {
          api_key : Joi.string()
        }
      },
      response : {
        schema : Joi.array().label('Favorites').items(
          Joi.object({
            label : Joi.string().example('Cafe plaisir'),
            color : Joi.string().example('#123456')
          }).label('Favorite')
        )
      }
    }
  }
];
