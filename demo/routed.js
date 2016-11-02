var model = {
  test: 'hi, welcome to router example',
};


var timerId = 'demo';
console.time(timerId);


var routes = {
  '/home': {
    model: {
      name: 'wgc',
      age: 18
    },
    methods: {
      clickme: function () {
        console.log(this);
        alert('hello ' + this.name + ', you are ' + this.age);
      }
    },
    preLink: function () {
      this.model.name = 'leon';
      this.model.gender = 'male';
    },
    templateUrl: 'views/tpl1.html'
  },
  '/index': {
    templateUrl: 'views/tpl2.html'
  },
  '/pre': {
    preLink: function () {
      location.href = 'index.html';
    }
  },
  '/tpl': {
    template: '<h1>hello,world</h1>'
  }
};

var routeConfig = {
  defaultPath: '/index',
  routes: routes
};


var linker = link({ model: model, routes: routeConfig });


console.timeEnd(timerId)