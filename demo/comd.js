var timerId = 'com';
console.time(timerId);

link.com({
  tag: 'hello-com',
  model: function () {
    return { name: 'leon' }
  },
  template: '<div>hello {{name}}</div>'
});

link.com({
  tag: 'hello-a',
  model: function () {
    return {
      name: 'leon',
      age: 18
    };
  },
  methods: {
    hi: function () {
      alert('hi ' + this.name);
    }
  },
  templateUrl: 'views/comTpl1.html'
});

link.com({
  tag: 'counter',
  model: function () {
    return { count: 0 }
  },
  template: '<button class="btn btn-default" @click="count++">{{count}}</button>'
});


registerPagerCom();

var linker = link({
  model: { name: 'wgc', pageCount: 10 }, methods: {
    myPageChange: function (currentPage) {
      console.log(currentPage);
    }
  }
});


console.timeEnd(timerId);