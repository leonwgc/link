import { configRoutes } from './route';
import compile, { applyDirs } from './compile';
import { glob } from './var';
import { extend, removeEventListenerHandler, each, isString } from './helper';
import renderComponent from './com';
import { LinkContext } from './linkContext';
import { Watcher } from './watcher';
import observe from './observer';

export default class Link {
  constructor(options) {
    this.el = isString(options.el) ? document.querySelector(options.el) : options.el;
    this.model = options.model || options.data;
    this._methods = options.methods;
    this._routes = options.routes;
    this._dirs = options.dirs;
    this._computed = options.computed;
    this._eventStore = [];
    this._watchers = [];
    this._children = [];
    this._routeEl = null;
    this._comCollection = [];
    this._unlinked = false;
    this._bootstrap();

    if (this._routes) {
      this._routeTplStore = Object.create(null);
      configRoutes(this);
    }
    if (glob.registeredTagsCount > 0 && this._comCollection.length > 0) {
      this._comTplStore = Object.create(null);
      this._renderComponent();
    }
  }

  _bootstrap() {
    observe(this.model);
    this._addComputed();
    this._compileDOM();
    this._watchers.forEach(item => item.update());
    if (this._methods) {
      extend(this.model, this._methods, true);
    }
  }

  _addComputed() {
    var getter;
    for (var prop in this._computed) {
      getter = this._computed[prop];
      if (typeof getter === 'function') {
        Object.defineProperty(this.model, prop, { enumerable: true, get: this._makeComputedGetter(getter) });
      } else {
        var conf = { enumerable: true };
        if (typeof getter.get === 'function') {
          conf.get = this._makeComputedGetter(getter.get);
        }
        if (typeof getter.set === 'function') {
          conf.set = getter.set;
        }
        Object.defineProperty(this.model, prop, conf);
      }
    }
  }

  _makeComputedGetter(getter) {
    var watcher = Watcher.get(getter, this, null).getDeps();
    return function() {
      if (watcher.dirty || Watcher.target) {
        watcher.getValue();
        watcher.dirty = false;
      }
      return watcher.value;
    }
  }

  _renderComponent() {
    var linker = this;
    each(this._comCollection, function(com) {
      renderComponent(linker, com);
    });
  }

  watch(watch, handler, deep) {
    Watcher.get(watch, this, handler, deep).getDeps();
  }

  _compileDOM() {
    if (!this._dirs) {
      compile(this, this.el);
    } else {
      applyDirs(this.el, this);
    }
  }

  unlink() {
    if (!this._unlinked) {
      this._unlinked = true;
      this._comCollection.length = 0;
      this._children.forEach(child => child.unlink());
      this._watchers.forEach(item => item.dead = true);
      each(this._eventStore, function(event) {
        removeEventListenerHandler(event.el, event.event, event.handler);
      });
      this._eventStore.length = 0;
      this.model = null;
    }
  }
}
