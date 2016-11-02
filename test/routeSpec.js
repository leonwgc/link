describe("route test suite", function () {
  var el = document.createElement('div');

  afterEach(function () {
    el.innerHTML = '';
    location.hash = '';
  });

  it("route without x-view", function () {
    var routes = {
      '/index': {
        model: {
          name: 'wgc'
        },
        template: '<h1>hello,world</h1>',
      }
    };

    var routeConfig = {
      defaultPath: '/index',
      routes: routes
    };

    var linker = link({ model: {}, routes: routeConfig });
    expect(location.hash).toEqual('#/index');
    linker.unlink();
  });

});