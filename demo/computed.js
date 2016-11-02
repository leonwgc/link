var model = {
  first: 'leon',
  last: 'wang'
};

var timerId = 'interpilation';
console.time(timerId);

var linker = link({
  model: model, computed: {
    full: {
      get: function() {
        return this.first + ' ' + this.last;
      },
      set: function(n) {
        if (n) {
          var s = n.split(' ');
          this.first = s[0];
          this.last = s[1];
        }
      }
    }
  }
});

console.timeEnd(timerId)