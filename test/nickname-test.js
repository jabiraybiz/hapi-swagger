/*
Mocha test
Tests that note array is broken up correctly
*/

var Chai            = require('chai'),
    Hapi            = require('hapi'),
    Joi             = require('joi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    HapiSwagger     = require('../lib/index.js');
    assert          = Chai.assert;
    
    
var defaultHandler = function(request, response) {
  reply('ok');
};


describe('route nickname test', function() {

    var server;

    beforeEach(function(done) {
      server = new Hapi.Server();
      server.connection();
      server.register([Inert, Vision, HapiSwagger], function(err){
        server.start(function(err){
          assert.ifError(err);
          done();
        });
      });
    });
  
    afterEach(function(done) {
      server.stop(function() {
        server = null;
        done();
      });
    });

    it('route uses specific nickname if supplied', function(done) {
      server.route({
        method: 'GET',
        path: '/test',
        handler: defaultHandler,
        config: {
          tags: ['api'],
          plugins: {
            'hapi-swagger': {
              nickname: 'getTest'
            }
          }
        }
      });
      server.inject({ method: 'GET', url: '/docs?path=test '}, function (response) {
        var nickname = response.result.apis[0].operations[0].nickname;
        assert.equal(nickname, 'getTest');
        done();
      });
    });

    it('route generates specific nickname if not supplied', function(done) {
      server.route({
        method: 'GET',
        path: '/test',
        handler: defaultHandler,
        config: {
          tags: ['api']
        }
      });
      server.inject({ method: 'GET', url: '/docs?path=test '}, function (response) {
        var nickname = response.result.apis[0].operations[0].nickname;
        assert.equal(nickname, 'test');
        done();
      });
    });
});
