const chai = require('chai');
const sinon = require('sinon');
const handlers = require('./../lib/handlers');
const pokemons = require('./../data/pokemons');
const favorites = require('./../data/favorites');

const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('Handlers', () => {

  describe('.helloWorld()', () => {
    it('should reply with Hello World !', () => {
      // Given
      const mySpy = sinon.spy();

      // When
      handlers.helloWorld({}, mySpy);

      // Then
      expect(mySpy).to.have.been.calledWith('Hello world!');
    });
  });

  describe('.getAllPokemons()', () => {
    it('should reply a list of pokemons !', () => {
      // Given
      const mySpy = sinon.spy();

      // When
      handlers.getAllPokemons({}, mySpy);

      // Then
      expect(mySpy).to.have.been.calledWith(require('./../data/pokemons'));
    });

    describe('when request has fields', () => {
      it('should reply a list of pokemons with the asked fields', () => {
        // Given
        const mySpy = sinon.spy();
        const request = { query : { fields : 'name' } };
        const data = [
          { name : 'Pikachu' },
          { name : 'Dracaufeu' },
          { name : 'Rattata' },
          { name : 'Roucool' },
          { name : 'Nidoran' },
          { name : 'Hypocéan' },
          { name : 'Kabuto' }
        ];

        // When
        handlers.getAllPokemons(request, mySpy);

        // Then
        expect(mySpy).to.have.been.calledWith(data);
      });
    });
  });

  describe('.createPokemon()', () => {
    before(() => {
      sinon.stub(pokemons, 'push');
    });

    after(() => {
      pokemons.push.restore();
    });

    it('should save the new pokemon into pokemons.json', () => {
      // Given
      const newPokemon = {
        fakeField: 'fakeValue'
      };
      const request = {
        payload: newPokemon
      };
      const fakeReply = () => ({
        code : () => {}
      });

      // When
      handlers.createPokemon(request, fakeReply);

      // Then
      expect(pokemons.push).to.have.been.calledWith(newPokemon);
    });
  });

  describe('.saveFavorite()', () => {
    before(() => {
      sinon.stub(favorites, 'push');
    });

    after(() => {
      favorites.push.restore();
    });

    it('should save the new favorite place into favorites.json', () => {
      // Given
      const newFavorite = {
        fakeField: 'fakeValue'
      };
      const request = {
        payload: newFavorite
      };
      const replySpy = () => ({
        code : () => sinon.spy()
      });

      // When
      handlers.saveFavorite(request, replySpy);

      // Then
      expect(favorites.push).to.have.been.calledWith(newFavorite);
    });
  });
});
