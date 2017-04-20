// TodoMVC app transplanted from vue example

// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~150 lines.

// localStorage persistence
var STORAGE_KEY = 'todos-link.js'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function(todos) {
    return todos.slice(0);
  },
  active: function(todos) {
    return todos.filter(function(todo) {
      return !todo.completed
    })
  },
  completed: function(todos) {
    return todos.filter(function(todo) {
      return todo.completed
    })
  }
}

// add filter 
link.filter('pluralize', function(n) {
  return n <= 1 ? 'item' : 'items'
});

// var n = performance.now();
var linker = link({

  // the root element that will be compiled
  el: document.querySelector('.todoapp'),

  model: {
    todos: todoStorage.fetch(),
    newTodo: '',
    editedTodo: null,
    // filteredTodos: [],
    // allDone: false,
    // remaining: 0,
    visibility: 'all'
  },

  computed: {
    filteredTodos: function() {
      return filters[this.visibility](this.todos)
    },
    remaining: function() {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function() {
        return this.remaining === 0;
      },
      set: function(value) {
        this.todos.forEach(function(todo) {
          todo.completed = value
        })
      }
    }
  },

  methods: {
    addTodo: function(ev) {
      if (ev.keyCode !== 13) return;
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      var todo = { title: value, completed: false };
      this.todos.push(todo);
      this.newTodo = '';
    },

    removeTodo: function(todo, index) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function(todo, ev) {
      if (ev.keyCode === 13) {
        //enter 
        if (!this.editedTodo) {
          return
        }
        this.editedTodo = null
        todo.title = todo.title.trim()
        if (!todo.title) {
          this.removeTodo(todo)
        }
      }
      else if (ev.keyCode === 27) {
        //esc
        this.cancelEdit(todo);
      }

    },

    cancelEdit: function(todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos);
    }
  }
});

linker.watch('todos', function() {
  todoStorage.save(this.todos);
  console.log(1)
  // this.filteredTodos = filters[this.visibility](this.todos);
}, true);

// linker.watch('filteredTodos', function() {
//   // this.remaining = filters.active(this.todos).length;
//   console.log(1)

// });

// linker.watch('allDone', function(value) {
//   var allDone = value;
//   this.todos.forEach(function(item) {
//     item.completed = allDone;
//   });
// });

// handle routing
function onHashChange() {
  var vm = linker.model;
  var filter = window.location.hash.replace(/#\/?/, '')
  if (filters[filter]) {
    vm.visibility = filter
  } else {
    window.location.hash = ''
    vm.visibility = 'all'
  }
  vm.filteredTodos = filters[vm.visibility](vm.todos);
}

window.addEventListener('hashchange', onHashChange)
onHashChange();

// console.log(performance.now() - n);
