export default function disabledHandler(linkContext) {
  if (linkContext.value) {
    linkContext.el.setAttribute("disabled", "disabled");
  } else {
    linkContext.el.removeAttribute("disabled");
  }
}