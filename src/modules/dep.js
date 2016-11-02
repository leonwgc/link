let uid = 0;
export default class Dep {
  constructor() {
    this.id = ++uid;
    this.has = Object.create(null);
    this.subs = [];
    this.deadSubs = [];
  }
  addSub(sub) {
    if (!this.has[sub.id]) {
      this.has[sub.id] = true;
      this.subs.push(sub);
    }
  }
  removeSub(sub) {
    if (this.has[sub.id]) {
      delete this.has[sub.id];
    }
    var i = this.subs.indexOf(sub);
    if (i > -1) {
      this.subs.splice(i, 1);
    }
  }
  notify(op) {
    this.subs.forEach(sub => {
      if (!sub.dead) {
        if (op) {
          sub.update(op);
        } else {
          sub.updateAsync();
        }
      } else {
        this.deadSubs.push(sub);
      }
    });
    if (this.deadSubs.length) {
      this.deadSubs.forEach(item => this.removeSub(item));
      this.deadSubs.length = 0;
    }
  }
}