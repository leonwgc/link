var model = {
  messages: []
};

for (var i = 0; i < 600; i++) {
  model.messages.push({
    title: 'title' + (i + 1),
    body: 'body' + (i + 1),
    time: (new Date()).toLocaleDateString(),
    focus: false
  });
}
var timerId = 'demo';
console.time(timerId);
var linker = link({
  el: '.t1',
  model: model
});
console.timeEnd(timerId);
