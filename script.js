$.ajax({
  type: 'GET',
  url: 'http://kitelore.com/api.php',
  success: function (data) {
    $('.optionBucket').html(data);
  },

  error: function (xhr, type, exception) {
    // if ajax fails display error alert
    alert('ajax error response type ' + type);
  },
});

$('img').click(function (e) {
    var offset = $(this).offset();
    $('.dataX').html(e.pageX - offset.left);
    $('.dataY').html(e.pageY - offset.top);
  });

$('img').mousemove(function (e) {
    var parentOffset = $(this).offset();
    var relativeXPosition = (e.pageX - parentOffset.left);
    var relativeYPosition = (e.pageY - parentOffset.top);
    $('.livePosition').html(relativeXPosition + ', ' + relativeYPosition);
  });
