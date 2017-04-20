import { addClass, removeClass } from '../modules/helper';

export default function classHandler(value) {
  if (this.className) {
    if (value) {
      addClass(this.el, this.className);
    } else {
      removeClass(this.el, this.className);
    }
  } else {
    if (value) {
      addClass(this.el, value);
    }
  }
}