describe("repeat test suite", function () {
  var el = document.createElement('div');
  describe('x-for', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-for 1", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
    });

    it("x-for 2", function () {
      var tpl = '<div x-for="item in a">{{item.name}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: [{ name: 'wgc', age: 18 }, { name: 'leon', age: 30 }] } });
      expect(el.textContent).toBe('wgcleon');
    });


    it("x-for unshift", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.unshift(0);
      expect(el.textContent).toBe('0123');
    });

    it("x-for push", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.push(4);
      expect(el.textContent).toBe('1234');
    });

    it("x-for pop", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.pop();
      expect(el.textContent).toBe('12');
    });

    it("x-for shift", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.shift();
      expect(el.textContent).toBe('23');
    });

    it("x-for reverse", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.reverse();
      expect(el.textContent).toBe('321');
    });

    it("x-for splice", function () {
      var tpl = '<div x-for="item in a">{{item}}</div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: [1, 2, 3] } });
      expect(el.textContent).toBe('123');
      linker.model.a.splice(1, 1);
      expect(el.textContent).toBe('13');
    });


  });

});