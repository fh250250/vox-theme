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
            var $vods = $(data.vods);
            $vods.find('img[data-original]').lazyload({
              threshold : 100,
              effect : 'fadeIn'
            });

            $('#vods').append($vods);
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
  var clipboard = new Clipboard('[data-copy-baidu]');

  var jump = function (url, msg) {
    $('#jump-modal').modal();
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

runInPage('video-detail', function () {
  var clipboard = new Clipboard('[data-copy-magnet]');

  clipboard.on('success', function (e) {
    $(e.trigger).text('复制成功');
  });

  clipboard.on('error', function (e) {
    $(e.trigger).text('复制失败');
  });
});

$(function () {
  $('img[data-original]').lazyload({
    threshold : 100,
    effect : 'fadeIn'
  });
});

$(function () {
  $('[data-scroll-nav]').each(function () {
    var iscroll = new IScroll(this, {
      scrollX: true,
      scrollY: false,
      click: true
    });

    iscroll.scrollToElement($(this).find('.active').get(0), 300, true, true);
  });
});
