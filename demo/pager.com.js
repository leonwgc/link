function registerPagerCom() {
  var model = {
    pageCount: 0,
    page: 1,
    pageNumbers: []
  };
  var props = ['pageCount', 'pageChange'];

  function getPageNumbers(page, pageCount, visiblePageCount) {
    visiblePageCount = visiblePageCount || 10;
    var low,
      high,
      v;

    var pageNumbers = [];

    if (pageCount === 0) {
      return;
    }
    if (page > pageCount) {
      page = 1;
    }

    if (pageCount <= visiblePageCount) {
      low = 1;
      high = pageCount;
    } else {
      v = Math.ceil(visiblePageCount / 2);
      low = Math.max(page - v, 1);
      high = Math.min(low + visiblePageCount - 1, pageCount);

      if (pageCount - high < v) {
        low = high - visiblePageCount + 1;
      }
    }

    for (; low <= high; low++) {
      pageNumbers.push(low);
    }

    return pageNumbers;;
  }

  function renderPageNumbers(vm) {
    var pageNumbers = getPageNumbers(vm.page, vm.pageCount) || [];
    vm.pageNumbers = pageNumbers;
  }

  link.com({
    tag: 'pager',
    model: function() {
      return model;
    },
    props: props,
    templateUrl: 'views/pager.html',
    created: function() {
      renderPageNumbers(this.model);
      this.watch('pageCount', function() {
        this.page = 1;
        renderPageNumbers(this);
      });

      this.watch('page', function() {
        renderPageNumbers(this);
        if (typeof this.pageChange === 'function') {
          this.pageChange(this.page);
        }
      });
    },
    // postLink: function(linker) {
    //   renderPageNumbers(this);
    //   linker.watch('pageCount', function() {
    //     this.page = 1;
    //     renderPageNumbers(this);
    //   });

    //   linker.watch('page', function() {
    //     renderPageNumbers(this);
    //     if (typeof this.pageChange === 'function') {
    //       this.pageChange(this.page);
    //     }
    //   });
    // }
  });
}