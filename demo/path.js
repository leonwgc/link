var model = {
  name: 'leon', age: 2,
  address: {
    city: 'sh',
    location:
    { area: 'minhang', postcode: '110' }
  }
};

var timerId = 'path';
console.time(timerId);

link.filter('json', function(o) {
  return JSON.stringify(o);
});

var linker = link({ model: model });

console.timeEnd(timerId)