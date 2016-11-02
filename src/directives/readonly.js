export default function readonlyHandler(linkContext) {
  if (linkContext.value) {
    linkContext.el.setAttribute("readonly", "readonly");
  } else {
    linkContext.el.removeAttribute("readonly");
  }
}