import { glob } from './var';
import { trim, loadTemplate, isFunction, each, parsePath } from './helper';
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
      loadTemplate(linker._comTplStore, config.templateUrl, function (tpl) {
        linkCom(linker, el, config, tpl);
      });
    }
  } else {
    linkCom(linker, el, config, template);
  }
}

function linkCom(linker, el, config, tpl) {
  if (!isFunction(config.model)) {
    throw new Error('component model must be a function to return a model data');
  }
  var model = config.model();
  var methods = config.methods || {};
  el.innerHTML = tpl;
  if (el.children.length > 1) {
    throw new Error('component can only have one root element');
  }
  if (Array.isArray(config.props)) {
    let parentProp, parentPropVal;
    each(config.props, function (prop) {
      parentProp = el.getAttribute(prop).trim();
      if (isFunction(linker.model[parentProp])) {
        methods[prop] = linker.model[parentProp];
      } else {
        parentPropVal = parsePath(parentProp)(linker.model);
        if (parentPropVal !== model[prop]) {
          model[prop] = parentPropVal;
        }
        linker.watch(parentProp, function (n) {
          model[prop] = n;
        });
      }
    });
  }

  var comLinker = new Link({ el: el.children[0], model: model, methods: methods });

  if (isFunction(config.postLink)) {
    config.postLink.call(model, comLinker, config);
  }
}
