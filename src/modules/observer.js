import { each, isObject } from './helper';
import { interceptArrayMethods } from './var';
import { Watcher } from './watcher';
import Dep from './dep';
const slice = Array.prototype.slice;
const push = Array.prototype.push;

function defineProperty(obj, key, value) {
  var dep = observe(value) || new Dep();

  Object.defineProperty(obj, key, {
    get: () => {
      var target = Watcher.target;
      if (target) {
        dep.addSub(target);
      }
      return value;
    },
    set: newVal => {
      if (newVal !== value) {
        if (newVal !== newVal && value !== value) {
          return;
        }
        value = newVal;

        if (typeof newVal === 'object' && newVal) {
          var oldDep = dep;
          dep = observe(newVal);
          oldDep.notify(Array.isArray(newVal));
        } else {
          dep.notify();
        }
      }
    }
  });
}

function interceptArray(arr) {
  each(interceptArrayMethods, function(method) {
    arr[method] = function(arg) {
      var args = slice.call(arguments);
      var result = args.length === 1 ? Array.prototype[method].call(arr, arg) :
        Array.prototype[method].apply(arr, args);
      var newAdded;
      switch (method) {
        case 'push':
          newAdded = args
          break
        case 'unshift':
          newAdded = args
          break
        case 'splice':
          newAdded = args.slice(2)
          break
      }
      if (newAdded) {
        newAdded.forEach(item => observe(item));
      }
      arr.__dep__.notify({ op: method, args: args });
      return result;
    };
  });
}

export default function observe(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.hasOwnProperty('__dep__') && obj.__dep__ instanceof Dep) {
    return obj.__dep__;
  }
  var dep = new Dep();
  Object.defineProperty(obj, '__dep__', { value: dep });
  if (Array.isArray(obj)) {
    interceptArray(obj);
    obj.forEach(item => observe(item));
  } else {
    Object.keys(obj).forEach(key => defineProperty(obj, key, obj[key]));
  }
  return dep;
}