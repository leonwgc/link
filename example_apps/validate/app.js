var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Firebase ref
// var usersRef = new Firebase('https://vue-demo.firebaseIO.com/users')


// create Vue app
var app = link({
  // element to mount to
  el: '#app',
  // initial data
  model: {
    newUser: {
      name: '',
      email: ''
    },
    users: []
  },
  // firebase binding
  // https://github.com/vuejs/vuefire
  // firebase: {
  //   users: usersRef
  // },
  // computed property for form validation state
  computed: {
    validation: function() {
      return {
        name: !!this.newUser.name.trim(),
        email: emailRE.test(this.newUser.email)
      }
    },
    isValid: function() {
      var validation = this.validation
      return Object.keys(validation).every(function(key) {
        return validation[key]
      })
    }
  },
  // methods
  methods: {
    addUser: function() {
      if (this.isValid) {
        this.users.push({name:this.newUser.name,email:this.newUser.email});
        this.newUser.name = ''
        this.newUser.email = ''
        return false;
      }
    },
    removeUser: function(user) {
      // users.child(user['.key']).remove()
      this.users.splice(this.users.indexOf(user), 1);
    }
  }
})
