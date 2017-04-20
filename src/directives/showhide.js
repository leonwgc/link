import { addClass, removeClass } from '../modules/helper';

export const showHanlder = showHideGen(true);
export const hideHanlder = showHideGen(false);

function showHideGen(isShow) {
  return function handler(value) {
    var el = this.el;
    if (isShow && value || !isShow && !value) {
      removeClass(el, 'x-hide');
      el.style.display = '';
    } else {
      addClass(el, 'x-hide');
      el.style.display = 'none';
    }
  }
}