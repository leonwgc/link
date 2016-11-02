describe("disabled test suite", function () {
  var el = document.createElement('div');
  describe('x-disabled', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-disabled 1", function () {
      var tpl = '<div x-disabled="a===1"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 1 } });
      expect(el.firstChild.hasAttribute('disabled')).toBe(true);
    });

    it("x-disabled 2", function () {
      var tpl = '<div x-disabled="a===1"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { a: 2 } });
      expect(el.firstChild.hasAttribute('disabled')).toBe(false);
    });
  });

});