'use strict';

require('mocha');
var assert = require('assert');
var define = require('define-property');
var use = require('./');

describe('use', function() {
  it('should export a function', function() {
    assert.equal(typeof use, 'function');
  });

  it('should throw TypeError `app` not a function or object', function() {
    function fixture () {
      use(123);
    }
    assert.throws(fixture, TypeError);
    assert.throws(fixture, /expect `app` be an object or function/);
  });

  it('should throw TypeError if not a function passed to `.use` method', function() {
    function fixture () {
      use({}).use(123);
    }
    assert.throws(fixture, TypeError);
    assert.throws(fixture, /expect `fn` be function/);
  });

  it('should decorate "use" onto the given object', function() {
    var app = {};
    use(app);
    assert.equal(typeof app.use, 'function');
  });

  it('should decorate "fns" onto the given object', function() {
    var app = {};
    use(app);
    assert(Array.isArray(app.fns));
  });

  it('should not re-add decorate methods onto the given object', function() {
    var app = {};
    use(app);
    assert(Array.isArray(app.fns));
    assert(app.fns.length === 0);
    app.use(function() {
      return function(ctx) {
        ctx.foo = 'bar';
      };
    });
    assert(app.fns.length === 1);
    use(app);
    assert(app.fns.length === 1);
  });

  it('should allow passing custom property to be used for plugins stack', function() {
    var app = {};
    use(app, { prop: 'plugins' });
    assert.strictEqual(Array.isArray(app.fns), false);
    assert.strictEqual(Array.isArray(app.plugins), true);
    assert(app.plugins.length === 0);

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

  it('should run all plugins on "fns" and decorate ctx', function() {
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
    assert.equal(typeof foo.use, 'function');
    assert.equal(typeof foo.run, 'function');
    assert(Array.isArray(foo.fns));
  });

  it('should run all plugins on "fns" and decorate ctx when .use is defined but .run is not', function() {
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
    define(foo, 'use', function() {});
    app.run(foo);
    assert.deepEqual(foo,  { a: 'b', c: 'd', e: 'f' });
    assert.equal(typeof foo.use, 'function');
    assert.equal(typeof foo.run, 'function');
    assert(Array.isArray(foo.fns));
  });

  it('should run all plugins on "fns" and decorate ctx when .run is defined but .use is not', function() {
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
    define(foo, 'run', function() {});
    app.run(foo);
    assert.deepEqual(foo,  { a: 'b', c: 'd', e: 'f' });
    assert.equal(typeof foo.use, 'function');
    assert.equal(typeof foo.run, 'function');
    assert(Array.isArray(foo.fns));
  });

  it('should run all plugins on "fns" and not decorate ctx when .use and .run are already defined', function() {
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
    define(foo, 'use', function(fn) {
      return fn.call(this, this);
    });
    define(foo, 'run', function() {});
    app.run(foo);
    assert.deepEqual(foo,  { a: 'b', c: 'd', e: 'f' });
    assert.equal(typeof foo.use, 'function');
    assert.equal(typeof foo.run, 'function');
    assert.equal(typeof foo.fns, 'undefined');
  });
});
