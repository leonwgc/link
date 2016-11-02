var model = {
  success: true,
  danger: true,
  name: '',
  style: ''
};

var s = ['hilight', 'btn-default', 'btn-danger', 'btn-info'];

var methods = {
  successHandler: function () {
    this.success = !this.success;
  },
  hilight: function () {
    this.style = s[Math.floor(Math.random() * s.length)];
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link({ model: model, methods: methods });

console.timeEnd(timerId)