describe("event test suite", function () {
  var el = document.createElement('div');
  function raiseEvent(el, type) {
    var event;
    if ('Event' in window) {
      event = new Event(type);
    }
    else {
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
    }
    if (el.dispatchEvent) {
      el.dispatchEvent(event);
    }
  }
  describe('event', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("event func()", function () {
      var tpl = '<div @click="add()">{{a}}</div>';
      el.innerHTML = tpl;
      link({
        el: el,
        model: { a: 1 },
        methods: {
          add: function () {
            ++this.a;
          }
        }
      });
      expect(el.children[0].textContent === '1').toBe(true);
      raiseEvent(el.children[0], 'click');
      expect(el.children[0].textContent === '2').toBe(true);
    });

    it("event func(w,s)", function () {
      var tpl = '<div @click="add(2,3)">{{a}}</div>';
      el.innerHTML = tpl;
      link({
        el: el,
        model: { a: 1 },
        methods: {
          add: function (a, b) {
            this.a = a + b;
          }
        }
      });
      expect(el.children[0].textContent === '1').toBe(true);
      raiseEvent(el.children[0], 'click');
      expect(el.children[0].textContent === '5').toBe(true);
    });

    it("event func(w,s,a)", function () {
      var tpl = '<div @click="add(a,2,3)">{{a}}</div>';
      el.innerHTML = tpl;
      var linker = link({
        el: el,
        model: { a: 1 },
        methods: {
          add: function (a, b, c) {
            this.a = a + b + c;
          }
        }
      });
      expect(el.children[0].textContent === '1').toBe(true);
      raiseEvent(el.children[0], 'click');
      expect(el.children[0].textContent === '6').toBe(true);
      linker.model.a = 2;
      raiseEvent(el.children[0], 'click');
      expect(el.children[0].textContent === '7').toBe(true);
    });

    it("event expr", function () {
      var tpl = '<div @click="a++">{{a}}</div>';
      el.innerHTML = tpl;
      link({
        el: el,
        model: { a: 1 }
      });
      expect(el.children[0].textContent === '1').toBe(true);
      raiseEvent(el.children[0], 'click');
      expect(el.children[0].textContent === '2').toBe(true);
    });
  });

});