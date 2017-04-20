export default function commonReact(linkContext, event) {
  function commonHandler() {
    linkContext.setPath(linkContext.el.value);
  }
  linkContext.linker._eventInfos.unshift({
    el: linkContext.el,
    name: event,
    handler: commonHandler
  });
}