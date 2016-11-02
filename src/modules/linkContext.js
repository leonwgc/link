import setModelReact from '../modelReact/index';
import { Watcher } from './watcher';
import { evalExprFilter, evalTextNodeFilter } from './eval';
import { hasFilter } from './lexer';
import { isFunction, extend, parsePath } from './helper';
import drm from '../directives/index';

const leftBracket = /(\{\{)/g;
const rightBracket = /(\}\})/g;

function filterFnGen(str, fromTextNode) {
  return function(model) {
    return fromTextNode ? evalTextNodeFilter(str, model) : evalExprFilter(str, model);
  }
}

function genLinkCb(context) {
  var fn = drm[context.directive];
  return function(newVal, oldVal, op) {
    context.value = newVal;
    return fn(context, newVal, oldVal, op);
  }
}

export class LinkContext {
  constructor(el, directive, linker) {
    this.el = el;
    this.directive = directive;
    this.linker = linker;
  }

  clone(el, linker) {
    var cloned = new LinkContext(el, this.directive, linker);
    extend(cloned, this, true);
    cloned.watcher = Watcher.get(this.watcher.getter, linker, genLinkCb(cloned));
    linker._watchers.push(cloned.watcher);
    if (this.directive === 'x-model') {
      setModelReact(cloned);
    }
    return cloned;
  }
  static create(el, directive, expr, text, linker, collector) {
    var is2Way = directive === 'x-model';
    var context = new LinkContext(el, directive, linker);
    if (!text) {
      context.watcher = Watcher.get(directive !== 'x-bind' ? expr : filterFnGen(expr, false), linker, genLinkCb(context));
    } else {
      context.watcher = Watcher.get(hasFilter(text, true) ? filterFnGen(text, true) : `"${text}"`.replace(leftBracket, '"+(').replace(rightBracket, ')+"'), linker, genLinkCb(context));
    }

    if (is2Way) {
      context.setPath = modelSetter(expr);
    }

    if (!collector) {
      if (is2Way) {
        setModelReact(context);
      }
      linker._watchers.push(context.watcher);
    }

    return context;
  }
}

function modelSetter(path) {
  var setter = parsePath(path);
  return function(val) {
    return setter(this.linker.model, val);
  }
}