describe("misc test suite", function () {
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

  describe('misc', function () {
    afterEach(function () {
      el.innerHTML = '';
    });

    // it("misc 1: when a watch is not in the model, add it as undefined", function () {
    //   var tpl = '<div x-bind="hello"></div>';
    //   el.innerHTML = tpl;
    //   var linker = link({ el: el, model: { a: 1 } });
    //   expect(el.firstChild.textContent === '').toBe(true);
    //   expect('hello' in linker.model).toBe(true);
    //   expect(linker.model.hello === undefined).toBe(true);
    // });

    // it("misc 2: when a watch is not in the model, add it as undefined,deep nested", function () {
    //   var tpl = '<div x-bind="b.c.d.e.f.g" @click="b.c.d.e.f.g=100"></div>';
    //   el.innerHTML = tpl;
    //   var linker = link({ el: el, model: { a: 1 } });
    //   expect(el.firstChild.textContent === '').toBe(true);
    //   expect('b' in linker.model).toBe(true);
    //   raiseEvent(el.firstChild, 'click');
    //   expect(linker.model.b.c.d.e.f.g).toEqual(100);
    //   expect(el.textContent).toEqual('100');

    // });

  });

});