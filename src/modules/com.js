import { glob } from './var';
import { trim, loadTemplate, isFunction, each, parsePath, extend } from './helper';
import Link from './linker';

export function registerComponent(config) {
  let tag = config.tag;
  if (!tag) {
    throw new Error('tag is required for a component!');
  }
  tag = tag.toUpperCase();
  if (!glob.registeredTags[tag]) {
    glob.registeredTags[tag] = config;
    ++glob.registeredTagsCount;
  }
}

export default function renderComponent(linker, com) {
  let config = com.config,
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
  var methods = config.methods || (config.methods = {});
  config.el = el.children[0];
  if (Array.isArray(config.props)) {
    let parentProp, parentPropVal;
    config.props.forEach(prop => {
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
