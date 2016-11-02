var model = {
  email: '',
  password: '',
  remember: true,
  greeting: '',
  fruit: [],
  sex: '男',
  a: {
    b: 'c'
  }
};

var methods = {
  clickme: function () {
    this.greeting = 'hello ' + this.email + ', your password is' + this.password + ', and you chooosed  ' + (this.remember ? 'remember' : 'forget it') +
      ', 你爱这些水果: ' + this.fruit.join(',');
  }
};

var timerId = 'demo';
console.time(timerId);

var linker = link({ model: model, methods: methods });

console.timeEnd(timerId)