describe("show hide test suite", function () {
  var el = document.createElement('div');
  describe('x-show', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-show 1", function () {
      var tpl = '<div x-show="name===' + "'wgc'" + '"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.className.indexOf('x-hide') === -1).toBe(true);
    });

    it("x-show 1", function () {
      var tpl = '<div x-show="name!==' + "'wgc'" + '"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.className.indexOf('x-hide') > -1).toBe(true);
    });
  });

  describe('x-hide', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("x-hide 1", function () {
      var tpl = '<div x-hide="name===' + "'wgc'" + '"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.className.indexOf('x-hide') > -1).toBe(true);
    });

    it("x-hide 1", function () {
      var tpl = '<div x-hide="name!==' + "'wgc'" + '"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.className.indexOf('x-hide') > -1).toBe(false);
    });
  });

});