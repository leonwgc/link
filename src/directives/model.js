import { isBoolean } from '../modules/helper';

export default function modelHandler(linkContext) {
  var el = linkContext.el;
  var value = linkContext.value;
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