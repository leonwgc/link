import { getCacheFn, isFunction, parsePath, each } from './helper';
import drm from '../directives/index';
import { LinkContext } from './linkContext';

const path = /^[\w$]+(\.[\w$]+)*$/;
let uid = 0;
const mutateOp = { op: 'mutate' };

function traverseObj(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(item => traverseObj(item));
  } else {
    Object.keys(obj).forEach(key => traverseObj(obj[key]));
  }
}

export class Watcher {
  constructor(exprOrFn, linker, cb, deep) {
    this.id = ++uid;
    this.getter = typeof exprOrFn === 'function' ? exprOrFn : path.test(exprOrFn) ? parsePath(exprOrFn) : getCacheFn(linker.model, exprOrFn);
    this.linker = linker;
    this.model = linker.model;
    this.deep = deep;
    this.lazy = !cb;
    this.cb = cb;
  }

  getDeps() {
    Watcher.target = this;
    this.value = this.getter.call(this.model, this.model);
    if (this.deep) {
      traverseObj(this.value);
    }
    Watcher.target = null;
    return this;
  }

  getValue() {
    this.value = this.getter.call(this.model, this.model);
  }

  update(arrayOpInfo) {
    if (this.lazy) {
      this.dirty = true;
      return;
    }
    var oldValue = this.value;
    this.getDeps();
    if (oldValue !== this.value || arrayOpInfo) {
      this.cb.call(this.model, this.value, oldValue, arrayOpInfo);
    } else if (Array.isArray(this.value)) {
      this.cb.call(this.model, this.value, oldValue, mutateOp);
    }
  }

  updateAsync() {
    Watcher.run(this);
  }

  // notify(oldValue, arrayOpInfo) {
  //   this.cb.call(this.model, this.value, oldValue, arrayOpInfo);
  // }

  static get(exprOrFn, linker, cb, deep) {
    return new Watcher(exprOrFn, linker, cb, deep);
  }
}
Watcher.target = null;

const queue = [];
let waiting = false;

Watcher.run = function(watcher) {
  if (link.sync) {
    watcher.update();
    return;
  }
  if (!watcher.waiting) {
    watcher.waiting = true;
    queue.push(watcher);
    if (!waiting) {
      waiting = true;
      setTimeout(() => {
        for (var i = 0, item; i < queue.length; i++) {
          item = queue[i];
          item.waiting = false;
          item.update();
        }
        queue.length = 0;
        waiting = false;
      }, 0);
    }
  }
}