import { isBoolean } from '../modules/helper';
export default function checkboxReact(linkContext) {
  var el = linkContext.el;
  function checkboxHandler() {
    var value = el.value,
      checked = el.checked,
      watchVal = linkContext.watcher.value,
      valIndex;

    if (isBoolean(watchVal)) {
      linkContext.setPath(checked);
    } else if (Array.isArray(watchVal)) {
      valIndex = watchVal.indexOf(value);
      if (!checked && valIndex > -1) {
        watchVal.splice(valIndex, 1);
      } else {
        watchVal.push(value);
      }
    } else {
      throw new Error('checkbox should bind with array or boolean value');
    }
  }
  linkContext.linker._eventInfos.unshift({
    el: el,
    name: 'click',
    handler: checkboxHandler
  });
}
