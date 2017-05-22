import commonReact from './common';
import checkboxReact from './checkbox';

export default function setModelReact(linkContext) {
  var el = linkContext.el,
    nodeName = el.nodeName,
    type = el.type;

  if (nodeName === 'INPUT') {
    switch (type) {
      case 'text':
      case 'password': {
        commonReact(linkContext, 'input');
        break;
      }
      case 'radio': {
        commonReact(linkContext, 'click');
        break;
      }
      case 'checkbox': {
        checkboxReact(linkContext);
        break;
      }
      default: {
        commonReact(linkContext, 'input');
        break;
      }
    }
  } else if (nodeName === 'SELECT') {
    commonReact(linkContext, 'change');
  } else {
    commonReact(linkContext, 'input');
  }
}