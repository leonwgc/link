// import { trim, loadTemplate, isFunction, isObject, extend } from './helper';
// import Link from './linker';

// export function hash(path) {
//   if (typeof path === 'undefined') {
//     var href = location.href,
//       index = href.indexOf('#');
//     return index === -1 ? '' : href.slice(index + 1);
//   } else {
//     location.hash = path;
//   }
// }

// function replaceHash(path) {
//   var href = location.href,
//     index = href.indexOf('#');
//   if (index > -1) {
//     location.replace(href.slice(0, index) + '#' + path);
//   } else {
//     location.replace(href + '#' + path);
//   }
// }

// export function configRoutes(linker) {
//   var routes = linker._routes.routes;
//   var defaultPath = linker._routes.defaultPath;
//   linker._eventInfos.unshift({
//     el: window,
//     name: 'hashchange',
//     handler: renderRouter
//   });
//   renderRouter();

//   function renderRouter() {
//     var route = routes[hash()];
//     if (!route) {
//       replaceHash(defaultPath);
//       return;
//     }
//     var template = trim(route.template);
//     if (!template) {
//       if (route.templateUrl) {
//         loadTemplate(linker._routeTplStore, route.templateUrl, function(tpl) {
//           linkRoute(linker, route, tpl);
//         });
//       } else {
//         linkRoute(linker, route, '');
//       }
//     } else {
//       linkRoute(linker, route, template);
//     }
//   }
// }

// let lastRouteLinker;

// function linkRoute(linker, route, tpl) {
//   if (lastRouteLinker) {
//     lastRouteLinker.unlink();
//     lastRouteLinker = undefined;
//   }
//   if (linker._routeEl) {
//     linker._routeEl.innerHTML = tpl;
//   }
//   lastRouteLinker = new Link(extend({
//     el: linker._routeEl
//   }, route, true));
// }