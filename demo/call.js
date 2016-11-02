function eachCall(arr, fn) {
  var len = arr.length, i = -1, item;
  while (++i < len) {
    item = arr[i];
    fn.call(arr, item, i, arr);
  }
}

function each(arr, fn) {
  var len = arr.length, i = -1, item;
  while (++i < len) {
    item = arr[i];
    fn(item, i, arr);
  }
}

t = performance.now();
function noop() { };
var times = 1000;
var arr = new Array(times)

i = 0;

// while (i++ < times) {
//   each(arr, noop);
// }
// console.log('no call ' + performance.now() - t);

function test(fn) {
  var i = 0;
  t = performance.now();
  while (i++ < times) {
    fn(arr, noop);
  }
  console.log(fn.name + ' :' + (performance.now() - t));
}