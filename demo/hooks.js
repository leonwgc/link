var model = {
  name: 'leon', age: 2,
  address: {
    city: 'sh',
    location:
    { area: 'minhang', postcode: '110' }
  }
};

var timerId = 'hooks';
console.time(timerId);


var linker = link({
  model: model,
  created: function() {
    console.log(JSON.stringify(this));
  }
});

console.timeEnd(timerId)