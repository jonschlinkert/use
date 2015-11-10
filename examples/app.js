
var util = require('util');
var plugins = require('base-plugins');

function Factory(config) {
  this.use = function(fn) {
    fn.call(this, this);
    return this;
  };
  this.use(plugins());
}


function Multi() {
  Factory.call(this);
  this.isMulti = true;
  this.apps = {};
}
util.inherits(Factory, Multi);

Multi.prototype.app = function(name) {
  var app = this.apps[name] = new App();
  this.run(app);
  return app;
};


function App() {
  Factory.call(this);
  this.isApp = true;
  this.collections = {};
}
util.inherits(Factory, App);

App.prototype.collection = function(name) {
  var collection = this.collections[name] = new Collection();
  this.run(collection);
  return collection;
};


function Collection() {
  Factory.call(this);
  this.isCollection = true;
  this.items = {};
}
util.inherits(Factory, Collection);

Collection.prototype.item = function(name) {
  var item = this.items[name] = new Item();
  this.run(item);
  return item;
};


function Item() {
  Factory.call(this);
  this.isItem = true;
  this.fields = {};
}
util.inherits(Factory, Item);

Item.prototype.field = function(name) {
  var field = this.fields[name] = new Field();
  this.run(field);
  return field;
};


function Field() {
  Factory.call(this);
  this.isField = true;
}
util.inherits(Factory, Field);

Field.prototype.field = function(key, val) {
  this[key] = val;
  this.run(val);
  return this;
};


var multi = new Multi();
multi.use(function fn(app) {
  if (!app.isItem) return fn;
  console.log(app)
});

var app = multi.app('b');
var collection = app.collection('c');
var item = collection.item('d');
var field = item.field('e');

