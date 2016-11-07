$('.main').onepage_scroll({
  sectionContainer: 'section',     // sectionContainer accepts any kind of selector in case you don't want to use section
  easing: 'ease-in-out',                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
  // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
  animationTime: 1200,             // AnimationTime let you define how long each section takes to animate
  pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
  updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
  beforeMove: function (index) {},  // This option accepts a callback function. The function will be called before the page moves.

  afterMove: function (index) {},   // This option accepts a callback function. The function will be called after the page moves.

  loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
  keyboard: true,                  // You can activate the keyboard controls
  responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
  // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
  // the browser's width is less than 600, the fallback will kick in.
  direction: 'horizontal',            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
});

$.ajax({
  type: 'GET',
  url: 'http://kitelore.com/api.php',
  data: 'request=getUsers',
  success: function (data) {
    $('.chipBucket').html(data);
  },

  error: function (xhr, type, exception) {
    // if ajax fails display error alert
    console.log('ajax error response type ' + type);
  },
});

function fadeIn(element) {
  $(element).addClass('animated');
  $(element).css('visibility', 'visible');
  $(element).addClass('fadeIn');
}

function fadeOut(element) {
  $(element).addClass('animated');
  $(element).addClass('fadeOut');
  $(element).css('visibility', 'hidden');
}

$('.loginEmail').keypress(function (e) {
  if (e.which == 13) {
    $('.loginSubmit').click();
    return false;
  }
});

$('.loginSubmit').click(function (event) {
  if ($('.loginEmail').val().length !== 0) {
    setupAnnotateHub();
  } else {
    fadeIn('.loginAlert');
  }
});

$('body').on('click', '.chip', function () {
  setupAnnotateHub();
  $('.loginEmail').val($(this).text());
});

function setupAnnotateHub() {
  refreshTable();
  populateMediaAndOptions();
  fadeIn('.annotate');

  $(document).ajaxStop(function () {
    $('.main').moveDown();
  });

}

function populateMediaAndOptions() {

  $.ajax({
    type: 'GET',
    url: 'http://kitelore.com/api.php',
    data: 'request=featureList',
    success: function (data) {
      $('.optionBucket').html(data);
    },

    error: function (xhr, type, exception) {
      // if ajax fails display error alert
      console.log('ajax error response type ' + type);
    },
  });

  checkOut();

}

var checkedOut;
function checkOut() {

  $.ajax({
    type: 'GET',
    url: 'http://kitelore.com/api.php',
    data: 'request=checkOut',
    success: function (data) {
        if (data === '') {
          data = 0;
        }

        checkedOut = parseInt(data) + 1;
        $('.img-responsive').attr('src', checkedOut + '.jpg');

      },

    error: function (xhr, type, exception) {
      // if ajax fails display error alert
      console.log('ajax error response type ' + type);
    },
  });

}

$('img').click(function (e) {
    var parentOffset = $(this).offset();
    $('.dataX').html((((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3) + ' %');
    $('.dataY').html((((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3) + ' %');
  });

$('img').mousemove(function (e) {
    var parentOffset = $(this).offset();
    var relativeXPosition = (((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3);
    var relativeYPosition = (((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3);
    $('.livePosition').html(relativeXPosition + ' %' + ', ' + relativeYPosition + ' %');
  });

function refreshTable() {
  $.ajax({
    type: 'GET',
    url: 'http://kitelore.com/api.php',
    data: 'request=getTable',
    success: function (data) {
      $('.table-bordered').html(data);
    },

    error: function (xhr, type, exception) {
      // if ajax fails display error alert
      console.log('ajax error response type ' + type);
    },
  });
}

$('.annotateSubmit').click(function (event) {

  var dataComplete = [];

  dataComplete.push({ user: $('.loginEmail').val() });
  dataComplete.push({ x: $('.dataX').text(), y: $('.dataY').text() });
  dataComplete.push({ pic_id: checkedOut });

  $('.optionBucket input[type="checkbox"]').each(function (index, ez) {
    var element = $(this).attr('val');
    var data = $(this).is(':checked');
    dataComplete.push({ feature: element, status: data * 1 });
  });

  $.ajax({
    type: 'POST',
    url: 'http://kitelore.com/api.php',
    data: 'request=submitAnnotation&data=' + JSON.stringify(dataComplete),
    success: function (data) {
      refreshTable();
      populateMediaAndOptions();
    },

    error: function (xhr, type, exception) {
      // if ajax fails display error alert
      console.log('ajax error response type ' + type);
    },
  });

});
