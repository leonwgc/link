var model = {
  messages: []
};

for (var i = 0; i < 300; i++) {
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
  model: model
});
console.timeEnd(timerId);
