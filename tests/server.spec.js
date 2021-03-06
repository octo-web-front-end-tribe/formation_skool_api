const chai = require('chai');
const expect = chai.expect;
const server = require('./../server');
chai.config.truncateThreshold = 0;

describe('Server', () => {
  describe('GET /', () => {
    describe('When api_key is missing', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject('/', (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When api_key is missing', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject('/?query=bad_key', (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When the api_key is correct', () => {
      it('should return the appropriate string', (done) => {
        server.inject('/?api_key=anass', (res) => {
          expect(res.result).to.equal('Hello world!');
          done();
        });
      });
    });
  });
  describe('GET /pokemons', () => {
    describe('When api_key is missing', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject('/pokemons', (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When api_key is incorrect', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject('/pokemons/?query=bad_key', (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When the correct api_key is given', () => {
      it('should return a 200', (done) => {
        server.inject('/pokemons?api_key=anass', (res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });

      it('should return an array', (done) => {
        server.inject('/pokemons?api_key=anass', (res) => {
          expect(res.result).to.be.an('array');
          done();
        });
      });

      it('should return a list of pokemons', (done) => {
        server.inject('/pokemons?api_key=anass', (res) => {
          expect(res.result).to.deep.equal(require('./../data/pokemons'));
          done();
        });
      });
    });

    describe('when I provide a list of fields', () => {
      it('should return the appropriate fields', (done) => {
        server.inject('/pokemons?api_key=anass&fields=name', (res) => {
          const pokemons = require('./../data/pokemons');
          expect(res.result).to.eql(pokemons.map((pokemon) => {
            return {
              name : pokemon.name
            };
          }));
          done();
        });
      });
    });
  });

  describe('POST /pokemons', () => {
    describe('When api_key is missing', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject({ method : 'post', url : '/pokemons' }, (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When api_key is incorrect', () => {
      it('should reject the request with a 401 status code', (done) => {
        server.inject({ method : 'post', url : '/pokemons?api_key=bad_key' }, (res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
    describe('When the correct api_key is given', () => {
      describe('when there is no payload', () => {
        it('should return 400', (done) => {
          server.inject({ method : 'post', url : '/pokemons?api_key=anass' }, (res) => {
            expect(res.statusCode).to.equal(400);
            done();
          });
        });
      });
      describe('when there is a payload', () => {
        describe('when name is missing', () => {
          it('should return 400', (done) => {
            server.inject({ method : 'post', url : '/pokemons?api_key=anass', payload : {} }, (res) => {
              expect(res.statusCode).to.equal(400);
              done();
            });
          });
        });
        it('should return 201', (done) => {
          server.inject({ method : 'post', url : '/pokemons?api_key=anass', payload : { name : 'Foobar' } }, (res) => {
            expect(res.statusCode).to.equal(201);
            done();
          });
        });
        it('should add a new pokemon to the list', (done) => {
          server.inject({ method : 'post', url : '/pokemons?api_key=anass', payload : { name : 'Foobar' } }, () => {
            server.inject('/pokemons?api_key=anass', (res) => {
              const foobar = res.result.find(pokemon => pokemon.name === 'Foobar');
              expect(foobar).to.exist;
              done();
            });
          });
        });
      });
    });
  });

  describe('POST /favorites', () => {
    it('should return 201', (done) => {
      const payload = {
        label : 'toto',
        color : '#123456',
        address: '34 avenue de l\'Opéra',
        coordinates: [
          1.1235678,
          1.87654321
        ]
      };
      server.inject({ method : 'post', url : '/favorites?api_key=roman', payload }, (res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
    });

    describe('When the color is invalid', () => {
      it('should return 400', (done) => {
        const payload = {
          label : 'toto',
          color : '#BLURP',
          address: '34 avenue de l\'Opéra',
          coordinates: [
            1.1235678,
            1.87654321
          ]
        };
        server.inject({ method : 'post', url : '/favorites?api_key=roman', payload }, (res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET /favorites', () => {
    it('should return a list of pokemons', (done) => {
      server.inject('/favorites?api_key=roman', (res) => {
        expect(res.result).to.deep.equal(require('./../data/favorites'));
        done();
      });
    });
  });
});
