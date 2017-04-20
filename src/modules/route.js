import { trim, loadTemplate, isFunction, isObject } from './helper';
import Link from './linker';

export function hash(path) {
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

export function configRoutes(linker) {
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
    if (!route.model || !isObject(route.model)) {
      route.model = {};
    }
    var template = trim(route.template);
    if (!template) {
      if (route.templateUrl) {
        loadTemplate(linker._routeTplStore, route.templateUrl, function (tpl) {
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

function linkRoute(linker, route, tpl) {
  var preLinkReturn;
  if (linker._routeEl) {
    linker._routeEl.innerHTML = tpl;
  }
  if (route.lastLinker) {
    route.lastLinker.unlink(); // destroy link
  }
  if (isFunction(route.preLink)) {
    preLinkReturn = route.preLink.call(route, linker);
  }
  if (preLinkReturn && isFunction(preLinkReturn.then)) {
    preLinkReturn.then(traceLink);
  } else {
    if (preLinkReturn === false) return; // skip link
    traceLink();
  }

  function traceLink() {
    if (!linker._routeEl) return; // no x-view , no route link 
    route.lastLinker = new Link({
      el: linker._routeEl,
      model: route.model,
      methods: route.methods
    });
    if (isFunction(route.postLink)) {
      route.postLink.call(route, route.lastLinker);
    }
  }
}