var model = {
  myloves: [{ name: 'mother', age: 50 }],
};

var time = 1;

var methods = {
  addLove: function () {
    var vm = this;
    vm.myloves.push({
      name: 'name' + time++,
      age: 18
    });
  },
  removeLove: function () {
    var vm = this;
    vm.myloves.splice(this.$index,1);
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link({ model: model, methods: methods });

console.timeEnd(timerId)