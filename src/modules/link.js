import { registerComponent } from './com';
import { filters } from './var';
import Link from './linker';

function link(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('options must be an object.');
  }
  if (!options.el) {
    options.el = window.document;
  }
  if (!options.model) {
    options.model = {};
  }
  return new Link(options);
};

link.filter = function (name, fn) {
  if (!filters[name] && typeof fn === 'function') {
    filters[name] = fn;
  }
};

link.com = registerComponent;
export default link;