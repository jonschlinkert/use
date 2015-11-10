'use strict';

require('mocha');
var assert = require('assert');
var use = require('./');

describe('use', function() {
  it('should export a function', function() {
    assert.equal(typeof use, 'function');
  });

  it('should decorate "use" onto the given object', function() {
    var app = {};
    use(app);
    assert.equal(typeof app.use, 'function');
  });

  it('should decorate "run" onto the given object', function() {
    var app = {};
    use(app);
    assert.equal(typeof app.run, 'function');
  });

  it('should decorate "fns" onto the given object', function() {
    var app = {};
    use(app);
    assert(Array.isArray(app.fns));
  });

  it('should immediately invoke a plugin function', function() {
    var app = {};
    use(app);
    var called = false;
    app.use(function(ctx) {
      called = true;
    });
    assert(called);
  });

  it('should push returned functions onto `fns`', function() {
    var app = {};
    use(app);
    app.use(function(ctx) {
      return function() {}
    });
    app.use(function(ctx) {
      return function() {}
    });
    app.use(function(ctx) {
      return function() {}
    });
    assert(app.fns.length === 3);
  });

  it('should run all plugins on "fns"', function() {
    var app = {};
    use(app);
    app.use(function(ctx) {
      return function(foo) {
        foo.a = 'b';
      }
    });
    app.use(function(ctx) {
      return function(foo) {
        foo.c = 'd';
      }
    });
    app.use(function(ctx) {
      return function(foo) {
        foo.e = 'f';
      }
    });
    var foo = {};
    app.run(foo);
    assert.deepEqual(foo,  { a: 'b', c: 'd', e: 'f' });
  });
});

describe('run', function() {
  it('should decorate "run" onto the given object', function() {
    var app = {};
    use(app);
    assert.equal(typeof app.run, 'function');
  });

  it('should return app', function() {
    var app = {};
    assert.equal(typeof use(app), 'object');
  });
});
