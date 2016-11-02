var model = {
  name: 'leon', age: 2,
  address: {
    city: 'sh',
    location:
    { area: 'minhang', postcode: '110' }
  }
};

var timerId = 'interpilation';
console.time(timerId);

var linker = link({model:model});

console.timeEnd(timerId)