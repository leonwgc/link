import { registerComponent } from './com';
import { filters } from './var';
import { isObject } from './helper';
import Link from './linker';

function link(config) {
  if (!isObject(config)) {
    throw new Error('config must be an object.');
  }
  if (!config.el) {
    config.el = window.document;
  }
  return new Link(config);
};

link.filter = function(name, fn) {
  if (!filters[name] && typeof fn === 'function') {
    filters[name] = fn;
  }
};

link.com = registerComponent;
export default link;