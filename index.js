/*!
 * use <https://github.com/jonschlinkert/use>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var wrapped = require('wrapped');
var define = require('define-property');
var isObject = require('isobject');

module.exports = function base() {
  return function(app) {
    if (!app.fns) {
      define(app, 'fns', []);
    }

    /**
     * Define a plugin function to be called immediately upon init.
     * The only parameter exposed to the plugin is the application
     * instance.
     *
     * Also, if a plugin returns a function, the function will be pushed
     * onto the `fns` array, allowing the plugin to be called at a
     * later point, elsewhere in the application.
     *
     * ```js
     * // define a plugin
     * function foo(app) {
     *   // do stuff
     * }
     *
     * // register plugins
     * var app = new Base()
     *   .use(foo)
     *   .use(bar)
     *   .use(baz)
     * ```
     * @name .use
     * @param {Function} `fn` plugin function to call
     * @return {Object} Returns the item instance for chaining.
     * @api public
     */

    define(app, 'use', use);

    /**
     * Run all plugins
     *
     * ```js
     * var config = {};
     * app.run(config);
     * ```
     * @name .run
     * @param {Object} `value` Object to be modified by plugins.
     * @return {Object} Returns the item instance for chaining.
     * @api public
     */

    define(app, 'run', function (val) {
      decorate(val);
      this.fns.forEach(function (fn) {
        val.use(fn);
      });
      return this;
    });
  };

  /**
   * Ensure the `.use` method exists on `val`
   */

  function decorate(val) {
    if (isObject(val) && !val.use) {
      define(val, 'fns', val.fns || []);
      define(val, 'use', use);
      val.use(base());
    }
  }

  /**
   * Call plugin `fn`. If a function is returned push it into the
   * `fns` array to be called by the `run` method.
   */

  function use(fn) {
    var plugin = fn.call(this, this);
    if (typeof plugin === 'function') {
      this.fns.push(plugin);
    }
    return this;
  }
};
