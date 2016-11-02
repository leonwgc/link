describe("filter test suite", function () {
  var el = document.createElement('div');

  function isString(str) {
    return typeof str === 'string';
  }

  function moneyFilter(str) {
    if (!Number(str)) return str;
    str = str + '';
    var digit = [],
      decimals = '',
      pointIndex = -1,
      groups = [],
      sep = ',';
    if ((pointIndex = str.indexOf('.')) > -1) {
      digit = str.slice(0, pointIndex).split('');
      decimals = str.slice(pointIndex);
    }
    else {
      digit = str.split('');
    }
    do {
      groups.unshift(digit.splice(-3).join(''));
    } while (digit.length > 0);

    return groups.join(sep) + decimals;
  }

  function uppercase(str) {
    if (isString(str)) {
      return str.toUpperCase();
    }
    return str;
  }
  function lowercase(str) {
    if (isString(str)) {
      return str.toLowerCase();
    }
    return str;
  }

  function phoneFilter(str) {
    if (isString(str) && str.length === 11) {
      return str.slice(0, 3) + '****' + str.slice(-4);
    }

    return str;
  }

  describe('filter', function () {
    beforeAll(function () {
      link.filter('money', moneyFilter);
      link.filter('uppercase', uppercase);
      link.filter('lowercase', lowercase);
      link.filter('phone', phoneFilter);
    });

    afterEach(function () {
      el.innerHTML = '';
    });

    it("interpilation not support", function () {
      var tpl = '<div>{{name | uppercase}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wgc' } });
      expect(el.firstChild.textContent === 'WGC').toBe(true);
      // expect(test).toThrowError();
    });

    it("interpilation not support", function () {
      var tpl = '<div>{{name | uppercase}}-{{name|lowercase}}</div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'wGc' } });
      expect(el.firstChild.textContent === 'WGC-wgc').toBe(true);
      // expect(test).toThrowError();
    });

    it("uppercase", function () {
      var tpl = '<div x-bind="name | uppercase"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'Wgc' } });
      expect(el.firstChild.textContent === 'WGC').toBe(true);
    });

    it("lowercase", function () {
      var tpl = '<div x-bind="name | lowercase"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { name: 'Wgc' } });
      expect(el.firstChild.textContent === 'wgc').toBe(true);
    });

    it("phone", function () {
      var tpl = '<div x-bind="phone | phone"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { phone: '15901634301' } });
      expect(el.firstChild.textContent === '159****4301').toBe(true);
    });

    it("phone 1", function () {
      var tpl = '<div x-bind="phone | phone"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { phone: '159' } });
      expect(el.firstChild.textContent === '159').toBe(true);
    });

    it("money 1", function () {
      var tpl = '<div x-bind="wealth | money"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { wealth: 123 } });
      expect(el.firstChild.textContent === '123').toBe(true);
    });

    it("money 2", function () {
      var tpl = '<div x-bind="wealth | money"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { wealth: 1234 } });
      expect(el.firstChild.textContent === '1,234').toBe(true);
    });

    it("money 2", function () {
      var tpl = '<div x-bind="wealth | money"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { wealth: 1234567 } });
      expect(el.firstChild.textContent === '1,234,567').toBe(true);
    });

    it("money 3", function () {
      var tpl = '<div x-bind="wealth | money"></div>';
      el.innerHTML = tpl;
      link({ el: el, model: { wealth: 1234567.8901 } });
      expect(el.firstChild.textContent === '1,234,567.8901').toBe(true);
    });

  });
});