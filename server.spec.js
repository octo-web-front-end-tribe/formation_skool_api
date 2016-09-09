const chai = require('chai');
const expect = chai.expect;
const server = require('./server');
chai.config.truncateThreshold = 0;

describe('Server', () => {
  describe('GET /', () => {
    it('should return the appropriate string', (done) => {
      server.inject('/', (res) => {
        expect(res.result).to.equal('Hello world!');
        done();
      });
    });
  });
  describe('GET /pokemons', () => {
    it('should return a 200', (done) => {
      server.inject('/pokemons', (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should return an array', (done) => {
      server.inject('/pokemons', (res) => {
        expect(res.result).to.be.an('array');
        done();
      });
    });

    it('should return a list of pokemons', (done) => {
      server.inject('/pokemons', (res) => {
        expect(res.result).to.deep.equal(require('./data'));
        done();
      });
    });

    describe('when I provide a list of fields', () => {
      it('should return the appropriate fields', (done) => {
        server.inject('/pokemons?fields=name', (res) => {
          const pokemons = require('./data');
          expect(res.result).to.eql(pokemons.map(pokemon => {
            return {
              name: pokemon.name
            }
          }));
          done();
        });
      });
    })
  });
});