import { newFunCacheKey } from './var';
export function isObject(obj) {
  return !!obj && typeof obj === 'object';
}

export function isFunction(func) {
  return (typeof func === 'function');
}

export function isString(str) {
  return typeof str === 'string';
}

export function isBoolean(v) {
  return typeof v === 'boolean';
}

export function isLikeJson(str) {
  return isString(str) && str[0] === '{' && str[str.length - 1] === '}';
}

export function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className = trim(el.className) + ' ' + className;
  }
}

export function removeClass(el, className) {
  if (el.className.indexOf(className) > -1) {
    el.className = el.className.replace(new RegExp(className, 'g'), '');
  }
}

export function trim(str) {
  if (typeof str === 'string') {
    return str.trim();
  }
  return str;
}

export function each(arr, fn) {
  var len = arr.length,
    i = -1;
  while (++i < len) {
    fn(arr[i], i, arr);
  }
}

export function extend(target, src, keepExist) {
  each(Object.keys(src), function(prop) {
    if (!target[prop] || !keepExist) {
      target[prop] = src[prop];
    }
  });
  return target;
}

export function loadTemplate(templateStore, url, cb) {
  var tpl = templateStore[url];
  if (tpl) {
    cb(tpl);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
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

// export function copy(src) {
//   if (isObject(src)) {
//     var dst = {},
//       val;
//     each(Object.keys(src), function (prop) {
//       val = src[prop];
//       if (Array.isArray(val)) {
//         dst[prop] = [];
//         each(val, function (item) {
//           dst[prop].push(copy(item));
//         });
//       } else if (isObject(val)) {
//         dst[prop] = copy(val);
//       } else {
//         dst[prop] = val;
//       }
//     });
//     return dst;
//   } else {
//     return src;
//   }
// }

export function parsePath(str) {
  const spliter = str.split('.'), len = spliter.length, last = spliter[len - 1];
  return function(model, val) {
    var v = model;
    for (var i = 0; i < len - 1; i++) {
      v = v[spliter[i]];
    }
    return arguments.length === 1 ? v[last] : (v[last] = val, undefined);
  }
}

const newFunCache = Object.create(null);

export function getCacheFn(model, expr) {
  return newFunCache[expr] || (newFunCache[expr] = getExprFn(expr));
}

export function getExprFn(expr) {
  return new Function('t', `with(t){ return ${expr};}`);
}