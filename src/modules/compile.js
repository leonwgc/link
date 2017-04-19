import { LinkContext } from './linkContext';
import { each, trim, isLikeJson, addEventListenerHandler, getCacheFn } from './helper';
import { eventPrefix, glob, testInterpolationRegex, spaceRegex } from './var';
import drm from '../directives/index';
import setModelReact from '../modelReact/index';

const exprEvFnCache = Object.create(null);

function getExprFn(expr) {
  return exprEvFnCache[expr] || (exprEvFnCache[expr] = new Function('m', '$event', `with(m){${expr}}`));
}

function genEventFn(expr, model) {
  var fn = getExprFn(expr);
  return function(ev) {
    fn(model, ev);
  }
}

class EventInfo {
  constructor(name, expr) {
    this.name = name;
    this.expr = expr;
  }

  static get(name, expr) {
    return new EventInfo(name, expr);
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

  each(kvPairs, function(kv) {
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

export function applyDirs(node, linker) {
  if (linker._dirs.length) {
    var dir = linker._dirs.shift();
    if (dir) {
      each(dir, function(o) {
        if (o instanceof LinkContext) {
          o.clone(node, linker);
        } else {
          addEventListenerHandler(node, o.name, genEventFn(o.expr, linker.model), linker._eventStore);
        }
      });
    }
    if (node.nodeType === 1) {
      each(node.childNodes, function(n) {
        applyDirs(n, linker);
      });
    }
  }
}

export default function compile(linker, el, collector) {
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
        expr = trim(el.getAttribute('x-for')); // var in watch
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
        if (linker._routeEl) throw new Error('a link context can only have on more than one x-view');
        el.removeAttribute('x-view');
        linker._routeEl = el;
        return;
      }

      each(el.attributes, function(attr) {
        attrName = attr.name;
        attrValue = attr.value.trim();
        if (drm[attrName]) {
          var contexts = getLinkContext(linker, el, attrName, attrValue, collector);
          if (collector) {
            dirs = dirs.concat(contexts);
          }
        } else if (attrName[0] === eventPrefix) {
          if (!collector) {
            addEventListenerHandler(el, attrName.slice(1), genEventFn(attrValue, linker.model), linker._eventStore);
          } else {
            dirs.push(EventInfo.get(attrName.slice(1), attrValue));
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
    each(el.childNodes, function(node) {
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
    each(el.childNodes, function(node) {
      compile(linker, node);
    });
  }
}



