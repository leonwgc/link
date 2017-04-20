export default function readonlyHandler(value) {
  if (value) {
    this.el.setAttribute("readonly", "readonly");
  } else {
    this.el.removeAttribute("readonly");
  }
}