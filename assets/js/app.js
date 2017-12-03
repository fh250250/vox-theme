function runInPage(page, func) {
  if ($('body').attr('id') === page) {
    $(func);
  }
}

runInPage('video-list', function () {
  var $window = $(window);
  var $document = $(document);
  var page = 2;
  var loading = false;

  var loader = {
    show: function () { $('.spinner').fadeIn(300); },
    hide: function () { $('.spinner').fadeOut(300); }
  };

  var loadMore = function () {
    if (
      $window.height() + $document.scrollTop() + 80 > $document.height() &&
      !loading
    ) {
      loading = true;
      $.request('onLoadMore', {
        data: { page: page },
        loading: loader,
        success: function (data) {
          if (data.count) {
            this.success(data);
            page++;
          } else {
            $window.unbind('scroll', loadMore);
            $('#loadmore-end').fadeIn(300);
          }
        },
        complete: function () {
          loading = false;
        }
      });
    }
  };

  $window.bind('scroll', loadMore);
});

runInPage('video-detail', function () {
  var clipboard = new Clipboard('[data-clipboard-text]');

  var jump = function (url, msg) {
    $('#jump-modal').modal({ backdrop: 'static' });
    $('#jump-modal .modal-body').text(msg);
    setTimeout(function () {
      window.location.href = url;
    }, 2000);
  };

  clipboard.on('success', function (e) {
    jump($(e.trigger).data('url'), '复制成功, 即将跳转网盘...');
  });

  clipboard.on('error', function (e) {
    jump($(e.trigger).data('url'), '复制失败, 硬件不支持, 即将跳转网盘...');
  });
});
