import { addClass, removeClass } from '../modules/helper';

export default function classHandler(linkContext) {
  var exprVal = linkContext.value;
  if (linkContext.className) {
    if (exprVal) {
      addClass(linkContext.el, linkContext.className);
    } else {
      removeClass(linkContext.el, linkContext.className);
    }
  } else {
    if (exprVal) {
      addClass(linkContext.el, exprVal);
    }
  }
}