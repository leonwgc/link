import { each, isObject, parsePath, isFunction } from '../modules/helper';
import Link from '../modules/linker';
import { spaceRegex } from '../modules/var';
import compile from '../modules/compile';

const primitiveType = ['string', 'number', 'boolean'];

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

export default function repeatHandler(linkContext, newArr, oldArr, arrayOpInfo) {
  if (arrayOpInfo && arrayOpInfo.op === 'mutate') return;
  var arr = newArr,
    varRef = linkContext.var,
    el = linkContext.el,
    comment = linkContext.comment,
    lastLinkers = linkContext.lastLinkers,
    allLinkers = linkContext.allLinkers, // for primitiveType
    parentNode = el.parentNode || comment.parentNode,
    valIsPrimitive = linkContext.valIsPrimitive;

  if (typeof (valIsPrimitive) === 'undefined' && arr.length) {
    valIsPrimitive = linkContext.valIsPrimitive = isPrimitive(arr[0]);
  }

  if (!lastLinkers) {
    lastLinkers = linkContext.lastLinkers = [];
    allLinkers = linkContext.allLinkers = [];
    comment = linkContext.comment = document.createComment(`${varRef}`);
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
    var linker, len, docFrag;
    var curLen = arr.length, lastLen = lastLinkers.length, allLen = allLinkers.length;

    if (!curLen) {
      if (lastLen) {
        each(lastLinkers, linker => {
          parentNode.removeChild(linker.el);
          if (!valIsPrimitive) linker.unlink();
        });
        lastLinkers.length = 0;
      }
      return;
    }

    if (valIsPrimitive) {
      if (lastLen >= curLen) {
        // only update model for reuse in lastLinkers
        each(arr, (item, index) => {
          lastLinkers[index].model[varRef] = item;
        });
        for (var i = curLen; i < lastLen; i++) {
          parentNode.removeChild(lastLinkers[i].el);
        }
        lastLinkers.length = curLen;
      } else {
        docFrag = document.createDocumentFragment();
        // reuse lastLinkers
        each(lastLinkers, (linker, index) => {
          linker.model[varRef] = arr[index];
        });
        var index = lastLen;
        // find in allLinkers if it has more to reuse
        if (allLen > lastLen) {
          do {
            linker = getUnUsedLinker();
            linker.model[varRef] = arr[index++];
            lastLinkers.push(linker);
            docFrag.appendChild(linker.el);
          } while (allLen > lastLinkers.length && index < curLen)
        }
        // no more to reuse , need to create new linker 
        while (index < curLen) {
          makeNew(arr[index], index++, valIsPrimitive, docFrag);
        }
      }
    } else {
      // no all linkers to reuse 
      docFrag = document.createDocumentFragment();
      each(lastLinkers, linker => {
        parentNode.removeChild(linker.el);
        linker.unlink();
      });
      lastLinkers.length = 0;
      each(arr, (item, index) => {
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

  if (arrayOpInfo) {
    var fn = arrayOpInfo.op,
      // watch = arrayOpInfo.watch,
      args = arrayOpInfo.args,
      hasNew = arrayOpInfo.hasNew,
      index,
      linker;

    switch (fn) {
      case 'push': {
        if (oldArr === newArr || newArr.length > oldArr.length) {
          index = arr.length - 1;
          linker = makeNew(arr[index], index, valIsPrimitive);
          parentNode.insertBefore(linker.el, comment);
        }
        break;
      }
      case 'pop': {
        if (oldArr === newArr || newArr.length < oldArr.length) {
          linker = lastLinkers.pop();
          parentNode.removeChild(linker.el);
          if (!valIsPrimitive) {
            linker.unlink();
          }
        }
        break;
      }
      case 'splice': {
        //todo: maybe it's add.
        linker = Array.prototype.splice.apply(lastLinkers, args);
        each(linker, item => {
          parentNode.removeChild(item.el);
          if (!valIsPrimitive) {
            item.unlink();
          }
        });
        each(lastLinkers, (linker, index) => {
          linker.model.$index = index;
        });
        break;
      }
      case 'unshift': {
        if (oldArr === newArr || newArr.length > oldArr.length) {
          linker = makeNew(arr[0], 0, valIsPrimitive, null, true);
          parentNode.insertBefore(linker.el, lastLinkers[0].el);
          lastLinkers.unshift(linker);
        }
        break;
      }
      case 'shift': {
        if (oldArr === newArr || newArr.length < oldArr.length) {
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