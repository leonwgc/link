export default function attrHandler(value) {
  this.el.setAttribute(this.directive, value);
}