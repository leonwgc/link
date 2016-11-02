import { addEventListenerHandler, removeEventListenerHandler } from '../modules/helper';
export default function commonReact(linkContext, event) {
  function commonHandler() {
    linkContext.setPath(linkContext.el.value);
  }
  addEventListenerHandler(linkContext.el, event, commonHandler, linkContext.linker._eventStore);
}