/*!
 * link.js v0.7.0
 * (c) 2016.10-2017 leonwgc
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.link = factory());
}(this, (function () { 'use strict';

var glob = {
  registeredTagsCount: 0,
  registeredTags: Object.create(null)
};
var testInterpolationRegex = /\{\{[^\}]+\}\}/;
var interpilationExprRegex = /\{\{([^\}]+)\}\}/g;
var spaceRegex = /\s+/;
var eventPrefix = '@';
var attrPrefix = ':';
var interceptArrayMethods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'];
var filters = Object.create(null);

function isObject(obj) {
  return !!obj && typeof obj === 'object';
}
function isFunction(func) {
  return (typeof func === 'function');
}
function isString(str) {
  return typeof str === 'string';
}
function isBoolean(v) {
  return typeof v === 'boolean';
}
function isLikeJson(str) {
  return isString(str) && str[0] === '{' && str[str.length - 1] === '}';
}
function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className = trim(el.className) + ' ' + className;
  }
}
function removeClass(el, className) {
  if (el.className.indexOf(className) > -1) {
    el.className = el.className.replace(new RegExp(className, 'g'), '');
  }
}
function trim(str) {
  if (typeof str === 'string') {
    return str.trim();
  }
  return str;
}
function each(arr, fn) {
  var len = arr.length,
    i = -1;
  while (++i < len) {
    fn(arr[i], i, arr);
  }
}
function extend(target, src, keepExist) {
  each(Object.keys(src), function (prop) {
    if (!target[prop] || !keepExist) {
      target[prop] = src[prop];
    }
  });
  return target;
}
function loadTemplate(templateStore, url, cb) {
  var tpl = templateStore[url];
  if (tpl) {
    cb(tpl);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          templateStore[url] = trim(xhr.responseText);
          cb(xhr.responseText);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'text/html');
    xhr.send(null);
  }
}
function parsePath(str) {
  var spliter = str.split('.'), len = spliter.length, last = spliter[len - 1];
  return function (model, val) {
    var v = model;
    for (var i = 0; i < len - 1; i++) {
      v = v[spliter[i]];
    }
    return arguments.length === 1 ? v[last] : (v[last] = val, undefined);
  }
}
var newFunCache = Object.create(null);
function getCacheFn(model, expr) {
  return newFunCache[expr] || (newFunCache[expr] = getExprFn(expr));
}
function getExprFn(expr) {
  return new Function('t', ("with(t){ return " + expr + ";}"));
}
var nextTick;
if (typeof Promise !== 'undefined' && typeof Promise.resolve === 'function') {
  var resolved = Promise.resolve();
  nextTick = function (f) {
    return resolved.then(f).catch(function (err) { throw err; });
  };
} else {
  nextTick = function (f) {
    setTimeout(f, 0);
  };
}

function hash(path) {
  if (typeof path === 'undefined') {
    var href = location.href,
      index = href.indexOf('#');
    return index === -1 ? '' : href.slice(index + 1);
  } else {
    location.hash = path;
  }
}
function replaceHash(path) {
  var href = location.href,
    index = href.indexOf('#');
  if (index > -1) {
    location.replace(href.slice(0, index) + '#' + path);
  } else {
    location.replace(href + '#' + path);
  }
}
function configRoutes(linker) {
  var routes = linker._routes.routes;
  var defaultPath = linker._routes.defaultPath;
  linker._eventInfos.unshift({
    el: window,
    name: 'hashchange',
    handler: renderRouter
  });
  renderRouter();
  function renderRouter() {
    var route = routes[hash()];
    if (!route) {
      replaceHash(defaultPath);
      return;
    }
    var template = trim(route.template);
    if (!template) {
      if (route.templateUrl) {
        loadTemplate(linker._routeTplStore, route.templateUrl, function(tpl) {
          linkRoute(linker, route, tpl);
        });
      } else {
        linkRoute(linker, route, '');
      }
    } else {
      linkRoute(linker, route, template);
    }
  }
}
var lastRouteLinker;
function linkRoute(linker, route, tpl) {
  if (lastRouteLinker) {
    lastRouteLinker.unlink();
    lastRouteLinker = undefined;
  }
  if (linker._routeEl) {
    linker._routeEl.innerHTML = tpl;
  }
  lastRouteLinker = new Link(extend({
    el: linker._routeEl
  }, route, true));
}

function commonReact(linkContext, event) {
  function commonHandler() {
    linkContext.setPath(linkContext.el.value);
  }
  linkContext.linker._eventInfos.unshift({
    el: linkContext.el,
    name: event,
    handler: commonHandler
  });
}

function checkboxReact(linkContext) {
  var el = linkContext.el;
  function checkboxHandler() {
    var value = el.value,
      checked = el.checked,
      watchVal = linkContext.watcher.value,
      valIndex;
    if (isBoolean(watchVal)) {
      linkContext.setPath(checked);
    } else if (Array.isArray(watchVal)) {
      valIndex = watchVal.indexOf(value);
      if (!checked && valIndex > -1) {
        watchVal.splice(valIndex, 1);
      } else {
        watchVal.push(value);
      }
    } else {
      throw new Error('checkbox should bind with array or boolean value');
    }
  }
  linkContext.linker._eventInfos.unshift({
    el: el,
    name: 'click',
    handler: checkboxHandler
  });
}

function setModelReact(linkContext) {
  var el = linkContext.el,
    nodeName = el.nodeName,
    type = el.type;
  if (nodeName === 'INPUT') {
    switch (type) {
      case 'text':
      case 'password': {
        commonReact(linkContext, 'keyup');
        break;
      }
      case 'radio': {
        commonReact(linkContext, 'click');
        break;
      }
      case 'checkbox': {
        checkboxReact(linkContext);
        break;
      }
      default: {
        commonReact(linkContext, 'keyup');
        break;
      }
    }
  } else if (nodeName === 'SELECT') {
    commonReact(linkContext, 'change');
  } else {
    commonReact(linkContext, 'keyup');
  }
}

function bindHandler(value) {
  this.el.textContent = value;
}

function classHandler(value) {
  if (this.className) {
    if (value) {
      addClass(this.el, this.className);
    } else {
      removeClass(this.el, this.className);
    }
  } else {
    if (value) {
      addClass(this.el, value);
    }
  }
}

function disabledHandler(value) {
  if (value) {
    this.el.setAttribute("disabled", "disabled");
  } else {
    this.el.removeAttribute("disabled");
  }
}

function modelHandler(value) {
  var el = this.el;
  if (el.type === 'radio') {
    var checked = (el.value === value);
    if (el.checked != checked) {
      el.checked = checked;
    }
  } else if (el.type === 'checkbox') {
    if (Array.isArray(value)) {
      el.checked = value.indexOf(el.value) > -1;
    } else if (isBoolean(value)) {
      if (el.checked !== value) {
        el.checked = value;
      }
    } else {
      throw Error('checkbox should bind with array or a boolean value');
    }
  } else {
    if (el.value != value) {
      el.value = value;
    }
  }
}

function readonlyHandler(value) {
  if (value) {
    this.el.setAttribute("readonly", "readonly");
  } else {
    this.el.removeAttribute("readonly");
  }
}

var primitiveType = ['string', 'number', 'boolean'];
function isPrimitive(val) {
  return primitiveType.indexOf(typeof val) > -1;
}
function makeLinker(linkContext, item, index, el, valIsPrimitive) {
  var model = linkContext.linker.model,
    linker,
    props = Object.create(null),
    dirs = linkContext.dirs;
  if (!dirs) {
    linkContext.dirs = dirs = [];
    compile(linkContext.linker, el, dirs);
  }
  props.$index = { value: index, enumerable: true, configurable: true, writable: true };
  props[linkContext.var] = { value: item, enumerable: true, configurable: true, writable: true };
  linker = new Link({ el: el, model: Object.create(model, props), dirs: dirs.slice() });
  linkContext.linker._children.push(linker);
  return linker;
}
function repeatHandler(newArr, oldArr, op) {
  if (op && op.op === 'mutate') { return; }
  var linkContext = this;
  var arr = newArr,
    varRef = this.var,
    el = this.el,
    comment = this.comment,
    lastLinkers = this.lastLinkers,
    allLinkers = this.allLinkers,
    parentNode = el.parentNode || comment.parentNode,
    valIsPrimitive = this.valIsPrimitive;
  if (typeof (valIsPrimitive) === 'undefined' && arr.length) {
    valIsPrimitive = this.valIsPrimitive = isPrimitive(arr[0]);
  }
  if (!lastLinkers) {
    lastLinkers = this.lastLinkers = [];
    allLinkers = this.allLinkers = [];
    comment = this.comment = document.createComment(("" + varRef));
    parentNode.insertBefore(comment, el);
    parentNode.removeChild(el);
  }
  function getUnUsedLinker() {
    var len = allLinkers.length;
    while (len--) {
      if (lastLinkers.indexOf(allLinkers[len]) === -1) {
        return allLinkers[len];
      }
    }
  }
  function rebuild() {
    var linker, docFrag;
    var curLen = arr.length, lastLen = lastLinkers.length, allLen;
    if (!curLen) {
      if (lastLen) {
        each(lastLinkers, function (linker) {
          parentNode.removeChild(linker.el);
          if (!valIsPrimitive) { linker.unlink(); }
        });
        lastLinkers.length = 0;
      }
      return;
    }
    if (valIsPrimitive) {
      if (lastLen >= curLen) {
        each(arr, function (item, index) {
          lastLinkers[index].model[varRef] = item;
        });
        for (var i = curLen; i < lastLen; i++) {
          parentNode.removeChild(lastLinkers[i].el);
        }
        lastLinkers.length = curLen;
      } else {
        docFrag = document.createDocumentFragment();
        allLen = allLinkers.length;
        each(lastLinkers, function (linker, index) {
          linker.model[varRef] = arr[index];
        });
        var index = lastLen;
        if (allLen > lastLen) {
          do {
            linker = getUnUsedLinker();
            linker.model[varRef] = arr[index++];
            lastLinkers.push(linker);
            docFrag.appendChild(linker.el);
          } while (allLen > lastLinkers.length && index < curLen)
        }
        while (index < curLen) {
          makeNew(arr[index], index++, valIsPrimitive, docFrag);
        }
      }
    } else {
      docFrag = document.createDocumentFragment();
      each(lastLinkers, function (linker) {
        parentNode.removeChild(linker.el);
        linker.unlink();
      });
      lastLinkers.length = 0;
      each(arr, function (item, index) {
        makeNew(item, index, valIsPrimitive, docFrag);
      });
    }
    if (docFrag) {
      parentNode.insertBefore(docFrag, comment);
    }
  }
  function makeNew(item, index, valIsPrimitive, docFrag, skipPushLast) {
    var linker = makeLinker(linkContext, item, index, el.cloneNode(true), valIsPrimitive);
    if (!skipPushLast) {
      lastLinkers.push(linker);
    }
    if (valIsPrimitive) {
      allLinkers.push(linker);
    }
    if (docFrag) {
      docFrag.appendChild(linker.el);
    }
    return linker;
  }
  if (op) {
    var fn = op.op,
      args = op.args,
      isSame = oldArr === newArr,
      index,
      linker;
    switch (fn) {
      case 'push': {
        if (isSame || newArr.length > oldArr.length) {
          index = arr.length - 1;
          linker = makeNew(arr[index], index, valIsPrimitive);
          parentNode.insertBefore(linker.el, comment);
        }
        break;
      }
      case 'pop': {
        if (isSame || newArr.length < oldArr.length) {
          linker = lastLinkers.pop();
          parentNode.removeChild(linker.el);
          if (!valIsPrimitive) {
            linker.unlink();
          }
        }
        break;
      }
      case 'splice': {
        linker = Array.prototype.splice.apply(lastLinkers, args);
        each(linker, function (item) {
          parentNode.removeChild(item.el);
          if (!valIsPrimitive) {
            item.unlink();
          }
        });
        each(lastLinkers, function (linker, index) {
          linker.model.$index = index;
        });
        break;
      }
      case 'unshift': {
        if (isSame || newArr.length > oldArr.length) {
          linker = makeNew(arr[0], 0, valIsPrimitive, null, true);
          parentNode.insertBefore(linker.el, lastLinkers[0].el);
          lastLinkers.unshift(linker);
        }
        break;
      }
      case 'shift': {
        if (isSame || newArr.length < oldArr.length) {
          linker = lastLinkers.shift();
          parentNode.removeChild(linker.el);
          if (!valIsPrimitive) {
            linker.unlink();
          }
        }
        break;
      }
      default: rebuild();
    }
  } else {
    rebuild();
  }
}

var showHanlder = showHideGen(true);
var hideHanlder = showHideGen(false);
function showHideGen(isShow) {
  return function handler(value) {
    var el = this.el;
    if (isShow && value || !isShow && !value) {
      removeClass(el, 'x-hide');
      el.style.display = '';
    } else {
      addClass(el, 'x-hide');
      el.style.display = 'none';
    }
  }
}

function attrHandler(value) {
  this.el.setAttribute(this.directive, value);
}

var drm = {
  'x-show': showHanlder,
  'x-hide': hideHanlder,
  'x-bind': bindHandler,
  'x-disabled': disabledHandler,
  'x-for': repeatHandler,
  'x-class': classHandler,
  'x-model': modelHandler,
  'x-readonly': readonlyHandler,
  ':': attrHandler
};

var path = /^[\w$]+(\.[\w$]+)*$/;
var uid = 0;
var mutateOp = { op: 'mutate' };
function traverseObj(obj) {
  if (!obj || typeof obj !== 'object') { return; }
  if (Array.isArray(obj)) {
    obj.forEach(function (item) { return traverseObj(item); });
  } else {
    Object.keys(obj).forEach(function (key) { return traverseObj(obj[key]); });
  }
}
var Watcher = function Watcher(exprOrFn, linker, cb, deep) {
  this.id = ++uid;
  this.getter = typeof exprOrFn === 'function' ? exprOrFn : path.test(exprOrFn) ? parsePath(exprOrFn) : getCacheFn(linker.model, exprOrFn);
  this.linker = linker;
  this.model = linker.model;
  this.deep = deep;
  this.lazy = !cb;
  this.cb = cb;
};
Watcher.prototype.getDeps = function getDeps () {
  Watcher.target = this;
  this.value = this.getter.call(this.model, this.model);
  if (this.deep) {
    traverseObj(this.value);
  }
  Watcher.target = null;
  return this;
};
Watcher.prototype.getValue = function getValue () {
  this.value = this.getter.call(this.model, this.model);
};
Watcher.prototype.update = function update (arrayOpInfo) {
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
};
Watcher.prototype.updateAsync = function updateAsync () {
  Watcher.run(this);
};
Watcher.get = function get (exprOrFn, linker, cb, deep) {
  return new Watcher(exprOrFn, linker, cb, deep);
};
Watcher.target = null;
var queue = [];
var waiting = false;
Watcher.run = function (watcher) {
  if (link.sync) {
    watcher.update();
    return;
  }
  if (!watcher.waiting) {
    watcher.waiting = true;
    queue.push(watcher);
    if (!waiting) {
      waiting = true;
      nextTick(function () {
        for (var i = 0, item; i < queue.length; i++) {
          item = queue[i];
          item.waiting = false;
          item.update();
        }
        queue.length = 0;
        waiting = false;
      });
    }
  }
};

function evalTextNodeFilter(text, model) {
  return text.replace(interpilationExprRegex, function (m, e) {
    return execFilterExpr(e, model);
  });
}
function evalExprFilter(expr, model) {
  return execFilterExpr(expr, model);
}
function execFilterExpr(expr, model) {
  var spliter = expr.split('|'), filter, subExpr;
  if (spliter.length === 1) {
    return getCacheFn(model, expr)(model);
  }
  subExpr = spliter[0].trim();
  filter = spliter[1].trim();
  return filters[filter](getCacheFn(model, subExpr)(model));
}

var checkFilterRegex = /\{\{[^\}\|]+\|[^\}\|]+\}\}/;
function hasFilter(text, fromTextNode) {
  if (!fromTextNode) {
    return checkFilter(text);
  } else {
    return checkFilterRegex.test(text);
  }
}
function checkFilter(text) {
  if (text.indexOf('|') === -1) { return false; }
  var len = text.length, i = 0, ch, next;
  while (i < len) {
    ch = text[i];
    if (ch === '"' || ch === "'") {
      next = i + 1;
      while (next < len && text[next] !== ch) {
        ++i;
      }
      if (i < len) {
        i += 2;
      } else {
        throw new Error('bad text');
      }
    } else if (ch === '|') {
      next = i + 1;
      if (next < len && text[next] !== ch) {
        return true;
      } else {
        i += 2;
      }
    } else {
      ++i;
    }
  }
  return false;
}

var leftBracket = /(\{\{)/g;
var rightBracket = /(\}\})/g;
function filterFnGen(str, fromTextNode) {
  return function (model) {
    return fromTextNode ? evalTextNodeFilter(str, model) : evalExprFilter(str, model);
  }
}
function makeUIHandler(context) {
  var fn = drm[!context.isAttrDir ? context.directive : attrPrefix];
  return function (newVal, oldVal, op) {
    return fn.call(context, newVal, oldVal, op);
  }
}
var LinkContext = function LinkContext(el, directive, linker, isAttrDir) {
  this.el = el;
  this.directive = directive;
  this.linker = linker;
  this.isAttrDir = isAttrDir;
};
LinkContext.prototype.clone = function clone (el, linker) {
  var cloned = new LinkContext(el, this.directive, linker);
  extend(cloned, this, true);
  cloned.watcher = Watcher.get(this.watcher.getter, linker, makeUIHandler(cloned));
  linker._watchers.push(cloned.watcher);
  if (this.directive === 'x-model') {
    setModelReact(cloned);
  }
  return cloned;
};
LinkContext.create = function create (el, directive, expr, text, linker, collector, isAttrDir) {
  var is2Way = directive === 'x-model';
  var context = new LinkContext(el, directive, linker, isAttrDir);
  if (!text) {
    context.watcher = Watcher.get(directive !== 'x-bind' ? expr : filterFnGen(expr, false), linker, makeUIHandler(context));
  } else {
    context.watcher = Watcher.get(hasFilter(text, true) ? filterFnGen(text, true) : ("\"" + text + "\"").replace(leftBracket, '"+(').replace(rightBracket, ')+"'), linker, makeUIHandler(context));
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
};
function modelSetter(path) {
  var setter = parsePath(path);
  return function (val) {
    return setter(this.linker.model, val);
  }
}

var exprEvFnCache = Object.create(null);
function getExprFn$1(expr) {
  return exprEvFnCache[expr] || (exprEvFnCache[expr] = new Function('m', '$event', '$el', ("with(m){" + expr + "}")));
}
function genEventFn(expr, model, el) {
  var fn = getExprFn$1(expr);
  return function (ev) {
    fn(model, ev, el);
  }
}
function getLinkContextsFromInterpolation(linker, el, text, collector) {
  return LinkContext.create(el, 'x-bind', null, text, linker, collector);
}
function getClassLinkContext(linker, el, directive, expr, collector) {
  var kvPairs = expr.slice(1, -1).split(','),
    spliter,
    linkContext;
  var contexts = [];
  each(kvPairs, function (kv) {
    spliter = kv.split(':');
    var linkContext = LinkContext.create(el, directive, spliter[1].trim(), null, linker, collector);
    linkContext.className = spliter[0].trim();
    contexts.push(linkContext);
  });
  return contexts;
}
function getLinkContext(linker, el, directive, expr, collector) {
  var linkContext;
  var contexts = [];
  if (!isLikeJson(expr)) {
    linkContext = LinkContext.create(el, directive, expr, null, linker, collector);
    contexts.push(linkContext);
  } else {
    linkContext = getClassLinkContext(linker, el, directive, expr, collector);
    contexts = contexts.concat(linkContext);
  }
  return contexts;
}
function applyDirs(node, linker) {
  if (linker._dirs.length) {
    var dir = linker._dirs.shift();
    if (dir) {
      each(dir, function (o) {
        if (o instanceof LinkContext) {
          o.clone(node, linker);
        } else {
          linker._eventInfos.push({
            el: node,
            name: o.name,
            handler: genEventFn(o.expr, linker.model, node)
          });
        }
      });
    }
    if (node.nodeType === 1) {
      each(node.childNodes, function (n) {
        applyDirs(n, linker);
      });
    }
  }
}
function compile(linker, el, collector) {
  var tag,
    expr,
    spliter,
    linkContext,
    hasAttributes,
    attrName,
    attrValue,
    len,
    nodeType = el.nodeType;
  var dirs = [];
  if (nodeType === 1) {
    hasAttributes = el.hasAttributes();
    if (hasAttributes) {
      if (el.hasAttribute('x-for')) {
        expr = trim(el.getAttribute('x-for'));
        spliter = expr.split(spaceRegex);
        len = spliter.length;
        if (!(len === 3 || len === 6)) {
          throw new Error('repeat only support expr like: var in array [track by expr].');
        }
        el.removeAttribute('x-for');
        linkContext = LinkContext.create(el, 'x-for', spliter[2], null, linker, collector);
        linkContext.var = spliter[0];
        if (len === 6) {
          linkContext.trackBy = spliter[5].slice(spliter[5].indexOf('.') + 1);
        }
        if (collector) {
          dirs.push(linkContext);
          collector.push(dirs);
        }
        return;
      }
      if (el.hasAttribute('x-view')) {
        if (linker._routeEl) { throw new Error('a link context can only have on more than one x-view'); }
        el.removeAttribute('x-view');
        linker._routeEl = el;
        return;
      }
      each(el.attributes, function (attr) {
        attrName = attr.name;
        attrValue = attr.value.trim();
        if (drm[attrName]) {
          var contexts = getLinkContext(linker, el, attrName, attrValue, collector);
          if (collector) {
            dirs = dirs.concat(contexts);
          }
        } else {
          var prefix = attrName[0];
          if (prefix === eventPrefix) {
            if (!collector) {
              linker._eventInfos.push({
                el: el,
                name: attrName.slice(1),
                handler: genEventFn(attrValue, linker.model, el)
              });
            } else {
              dirs.push({ name: attrName.slice(1), expr: attrValue });
            }
          } else if (prefix === attrPrefix) {
            linkContext = LinkContext.create(el, attrName.slice(1), attrValue, null, linker, collector, true);
            if (collector) {
              dirs.push(linkContext);
            }
          }
        }
      });
    }
    if (glob.registeredTagsCount > 0) {
      tag = el.tagName.toUpperCase();
      if (glob.registeredTags[tag]) {
        linker._comCollection.push({
          el: el,
          config: glob.registeredTags[tag]
        });
        return;
      }
    }
    if (collector) {
      collector.push(dirs.length ? dirs : null);
    }
    each(el.childNodes, function (node) {
      compile(linker, node, collector);
    });
  } else if (nodeType === 3) {
    expr = el.textContent.trim();
    if (expr.length && testInterpolationRegex.test(expr)) {
      dirs.push(getLinkContextsFromInterpolation(linker, el, expr, collector));
    }
    if (collector) {
      collector.push(dirs.length ? dirs : null);
    }
  } else if (nodeType === 9) {
    each(el.childNodes, function (node) {
      compile(linker, node);
    });
  }
}

var uid$1 = 0;
var Dep = function Dep() {
  this.id = ++uid$1;
  this.has = Object.create(null);
  this.subs = [];
  this.deadSubs = [];
};
Dep.prototype.addSub = function addSub (sub) {
  if (!this.has[sub.id]) {
    this.has[sub.id] = true;
    this.subs.push(sub);
  }
};
Dep.prototype.removeSub = function removeSub (sub) {
  if (this.has[sub.id]) {
    delete this.has[sub.id];
  }
  var i = this.subs.indexOf(sub);
  if (i > -1) {
    this.subs.splice(i, 1);
  }
};
Dep.prototype.notify = function notify (op) {
    var this$1 = this;
  this.subs.forEach(function (sub) {
    if (!sub.dead) {
      if (op) {
        sub.update(op);
      } else {
        sub.updateAsync();
      }
    } else {
      this$1.deadSubs.push(sub);
    }
  });
  if (this.deadSubs.length) {
    this.deadSubs.forEach(function (item) { return this$1.removeSub(item); });
    this.deadSubs.length = 0;
  }
};

var slice = Array.prototype.slice;
function defineProperty(obj, key, value) {
  var dep = observe(value) || new Dep();
  Object.defineProperty(obj, key, {
    get: function () {
      var target = Watcher.target;
      if (target) {
        dep.addSub(target);
      }
      return value;
    },
    set: function (newVal) {
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
          newAdded = args;
          break
        case 'unshift':
          newAdded = args;
          break
        case 'splice':
          newAdded = args.slice(2);
          break
      }
      if (newAdded) {
        newAdded.forEach(function (item) { return observe(item); });
      }
      arr.__dep__.notify({ op: method, args: args });
      return result;
    };
  });
}
function observe(obj) {
  if (!obj || typeof obj !== 'object') { return; }
  if (obj.hasOwnProperty('__dep__') && obj.__dep__ instanceof Dep) {
    return obj.__dep__;
  }
  var dep = new Dep();
  Object.defineProperty(obj, '__dep__', { value: dep });
  if (Array.isArray(obj)) {
    interceptArray(obj);
    obj.forEach(function (item) { return observe(item); });
  } else {
    Object.keys(obj).forEach(function (key) { return defineProperty(obj, key, obj[key]); });
  }
  return dep;
}

var LifeCycles = ['created'];
var Link = function Link(config) {
  this.el = isString(config.el) ? document.querySelector(config.el) : config.el;
  this.model = config.model || {};
  this._methods = config.methods;
  this._routes = config.routes;
  this._dirs = config.dirs;
  this._computed = config.computed;
  this._eventInfos = [];
  this._watchers = [];
  this._children = [];
  this._routeEl = null;
  this._comCollection = [];
  this._unlinked = false;
  this._initLifeCycleHooks(config);
  this._bootstrap();
  if (this._routes) {
    this._routeTplStore = Object.create(null);
    configRoutes(this);
  }
  if (glob.registeredTagsCount > 0 && this._comCollection.length > 0) {
    this._comTplStore = Object.create(null);
    this._renderComponent();
  }
  if (typeof this.created === 'function') {
    this.created();
  }
  this._bindEvents();
};
Link.prototype._initLifeCycleHooks = function _initLifeCycleHooks (config) {
  var hook, linker = this;
  Object.keys(config).forEach(function (key) {
    if (LifeCycles.indexOf(key) > -1) {
      hook = config[key];
      if (typeof hook === 'function') {
        linker[key] = hook;
      }
    }
  });
};
Link.prototype._bindEvents = function _bindEvents () {
  this._eventInfos.forEach(function (e) { return e.el.addEventListener(e.name, e.handler, false); });
};
Link.prototype._unbindEvents = function _unbindEvents () {
  this._eventInfos.forEach(function (e) { return e.el.removeEventListener(e.name, e.handler, false); });
  this._eventInfos.length = 0;
};
Link.prototype._bootstrap = function _bootstrap () {
  observe(this.model);
  this._addComputed();
  this._compileDOM();
  this._watchers.forEach(function (item) { return item.update(); });
  if (this._methods) {
    extend(this.model, this._methods, true);
  }
};
Link.prototype._addComputed = function _addComputed () {
    var this$1 = this;
  var getter;
  for (var prop in this._computed) {
    getter = this$1._computed[prop];
    if (typeof getter === 'function') {
      Object.defineProperty(this$1.model, prop, { enumerable: true, get: this$1._makeComputedGetter(getter) });
    } else {
      var conf = { enumerable: true };
      if (typeof getter.get === 'function') {
        conf.get = this$1._makeComputedGetter(getter.get);
      }
      if (typeof getter.set === 'function') {
        conf.set = getter.set;
      }
      Object.defineProperty(this$1.model, prop, conf);
    }
  }
};
Link.prototype._makeComputedGetter = function _makeComputedGetter (getter) {
  var watcher = Watcher.get(getter, this, null).getDeps();
  return function() {
    if (watcher.dirty || Watcher.target) {
      watcher.getValue();
      watcher.dirty = false;
    }
    return watcher.value;
  }
};
Link.prototype._renderComponent = function _renderComponent () {
  var linker = this;
  each(this._comCollection, function(com) {
    renderComponent(linker, com);
  });
};
Link.prototype.watch = function watch (watch, handler, deep) {
  Watcher.get(watch, this, handler, deep).getDeps();
};
Link.prototype._compileDOM = function _compileDOM () {
  if (!this._dirs) {
    compile(this, this.el);
  } else {
    applyDirs(this.el, this);
  }
};
Link.prototype.unlink = function unlink () {
  if (!this._unlinked) {
    this._unlinked = true;
    this._comCollection.length = 0;
    this._children.forEach(function (child) { return child.unlink(); });
    this._watchers.forEach(function (item) { return item.dead = true; });
    this._unbindEvents();
    this.model = null;
  }
};

function registerComponent(config) {
  var tag = config.tag;
  if (!tag) {
    throw new Error('tag is required for a component!');
  }
  tag = tag.toUpperCase();
  if (!glob.registeredTags[tag]) {
    glob.registeredTags[tag] = config;
    ++glob.registeredTagsCount;
  }
}
function renderComponent(linker, com) {
  var config = com.config,
    template = trim(config.template),
    el = com.el;
  if (!template) {
    if (config.templateUrl) {
      loadTemplate(linker._comTplStore, config.templateUrl, function(tpl) {
        linkCom(linker, el, config, tpl);
      });
    }
  } else {
    linkCom(linker, el, config, template);
  }
}
function linkCom(linker, el, comConfig, tpl) {
  el.innerHTML = tpl;
  if (el.children.length > 1) {
    throw new Error('component can only have one root element');
  }
  var config = extend({}, comConfig);
  if (config.model && typeof config.model !== 'function') {
    throw new Error('component model must be a function to return a model data');
  }
  var model = config.model = config.model();
  var methods = config.methods || {};
  config.el = el.children[0];
  if (Array.isArray(config.props)) {
    var parentProp, parentPropVal;
    config.props.forEach(function (prop) {
      parentProp = el.getAttribute(prop).trim();
      if (isFunction(linker.model[parentProp])) {
        methods[prop] = linker.model[parentProp];
      } else {
        parentPropVal = parsePath(parentProp)(linker.model);
        if (parentPropVal !== model[prop]) {
          model[prop] = parentPropVal;
        }
        linker.watch(parentProp, function(n) {
          model[prop] = n;
        });
      }
    });
  }
  linker._children.push(new Link(config));
}

function link$1(config) {
  if (!isObject(config)) {
    throw new Error('config must be an object.');
  }
  if (!config.el) {
    config.el = window.document;
  }
  return new Link(config);
}
link$1.filter = function(name, fn) {
  if (!filters[name] && typeof fn === 'function') {
    filters[name] = fn;
  }
};
link$1.com = registerComponent;

return link$1;

})));
