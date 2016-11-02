var model = {
  age: 18
};

var timerId = 'demo';
console.time(timerId);

var methods = {
  hello: function () {
    alert('hello');
  },
  hi: function (name, age,$event) {
    alert('hi ' + name + ' you are ' + age + ' years old');
  }
};


var linker = link({ model: model, methods: methods });


console.timeEnd(timerId)