registerPagerCom();

var model = {
  messages: [],
  pageCount: 30
};
var msgStore = [];
var pageSize = 10;

for (var i = 0; i < 300; i++) {
  msgStore.push({
    id:i,
    title: 'title' + (i + 1),
    body: 'body' + (i + 1),
    time: (new Date()).toLocaleDateString(),
    focus: false
  });
}

function loadMessage(vm, page) {
  vm.messages = msgStore.slice((page - 1) * pageSize, page * pageSize);
}

var methods = {
  pageChange: function (page) {
    loadMessage(linker.model, page);
  }
};

var timerId = 'demo';
console.time(timerId);
var linker = link({ model: model, methods: methods });
loadMessage(linker.model, 1);
console.timeEnd(timerId);