describe("readonly test suite", function () {
  var el = document.createElement('div');
  describe('x-readonly', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-readonly 1", function () {
      var tpl = '<div x-readonly="a===1"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 1 } });
      expect(el.firstChild.hasAttribute('readonly')).toBe(true);
    });

    it("x-readonly 2", function () {
      var tpl = '<div x-readonly="a===1"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 2 } });
      expect(el.firstChild.hasAttribute('readonly')).toBe(false);
    });
  });

});