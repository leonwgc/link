describe("bind test suite", function () {
  var el = document.createElement('div');

  describe('x-bind', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    it("interpilation 1", function () {
      var tpl = '<div>{{name}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.textContent === 'wgc').toBe(true);
    });

    it("interpilation 2", function () {
      var tpl = '<div>{{name}} {{age}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc', age: 18 } });
      expect(el.firstChild.textContent === 'wgc 18').toBe(true);
    });

    it("x-bind 1", function () {
      var tpl = '<div x-bind="name"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.textContent === 'wgc').toBe(true);
    });

    it("x-bind 2", function () {
      var tpl = '<div x-bind="name+age"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc', age: 18 } });
      expect(el.firstChild.textContent === 'wgc18').toBe(true);
    });

    it("x-bind 2", function () {
      var tpl = '<div x-bind="name+' + "'18'" + '"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.textContent === 'wgc18').toBe(true);
    });


  });
});