describe("component test suite", function () {
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

  describe('component', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("component 1", function () {
      link.com({
        tag: 'hello-com',
        model: function () {
          return { name: 'leon' };
        },
        template: '<div>{{name}}</div>'
      });

      var tpl = '<hello-com/>';
      el.innerHTML = tpl;
      var linker = link({ el: el });

      expect(el.textContent).toEqual('leon');
    });

    it("component 2 with methods", function () {
      link.com({
        tag: 'hello-com-2',
        model: function () {
          return { name: 'leon' };
        },
        methods: {
          test: function () {
            this.name = 'wgc';
          }
        },
        template: '<div @click="test()">{{name}}</div>'
      });

      var tpl = '<hello-com-2/>';
      el.innerHTML = tpl;
      var linker = link({ el: el });

      expect(el.textContent).toEqual('leon');
      raiseEvent(el.firstChild.firstChild, 'click');
      expect(el.textContent).toEqual('wgc');
    });

    it("component 3 with props", function () {
      link.com({
        tag: 'hello-com-3',
        model: function () {
          return { name: 'leon' };
        },
        methods: {
          test: function () {
            this.name = 'wgc';
          }
        },
        props: ["name"],
        template: '<div @click="test()">{{name}}</div>',
      });

      var tpl = '<hello-com-3 name="outerName"/>';
      el.innerHTML = tpl;
      var linker = link({
        el: el, model: {
          outerName: 'leonwgc'
        }
      });
      // name linked with outer linker.model.outerName
      expect(el.textContent).toEqual('leonwgc');
      raiseEvent(el.firstChild.firstChild, 'click');
      expect(el.textContent).toEqual('wgc');

      linker.model.outerName = 'fish';
      expect(el.textContent).toEqual('fish');

    });

    it("component counter", function () {
      link.com({
        tag: 'counter',
        model: function () {
          return { count: 0 };
        },
        template: '<div @click="count++">{{count}}</div>'
      });

      var tpl = '<counter></counter><counter></counter>';
      el.innerHTML = tpl;
      var linker = link({ el: el });

      expect(el.textContent).toEqual('00');
      raiseEvent(el.firstChild.firstChild, 'click');
      expect(el.textContent).toEqual('10');
      raiseEvent(el.children[1].firstChild, 'click');
      expect(el.textContent).toEqual('11');
    });

  });

});
