describe("class test suite", function () {
  var el = document.createElement('div');
  describe('x-class', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-class 1", function () {
      var tpl = '<div x-class="{c1:a===1}"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 1 } });
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
    });

    it("x-class 2", function () {
      var tpl = '<div x-class="{c1:a===1,c2:b==2}"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 1, b: 2 } });
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
      expect(el.firstChild.className.indexOf('c2') > -1).toBe(true);
    });

    it("x-class 3", function () {
      var tpl = '<div x-class="{c1:a===1,c2:b==2}"></div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: 1, b: 2 } });
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
      expect(el.firstChild.className.indexOf('c2') > -1).toBe(true);
      linker.model.b = 3;
      expect(el.firstChild.className.indexOf('c2') > -1).toBe(false);
    });

    it("x-class 4", function () {
      var tpl = '<div x-class="{c1:a===b}"></div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: 1, b: 2 } });
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(false);
      linker.model.b = 1;
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
      linker.model.a = 2;
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(false);
      linker.model.b = 2;
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
    });

    it("x-class 5", function () {
      var tpl = '<div x-class="a"></div>';
      el.innerHTML = tpl;
      var linker = link({ el: el, model: { a: 'c1' } });
      expect(el.firstChild.className.indexOf('c1') > -1).toBe(true);
    });

  });

});