/*

Scrolling plugin

*/
//--------------------------------------------------------
$('.main').onepage_scroll({
    sectionContainer: 'section',
    easing: 'ease-in-out',
    animationTime: 1200,
    pagination: false,
    updateURL: false,
    beforeMove: function (index) {},

    afterMove: function (index) {},

    loop: false,
    responsiveFallback: false,
    hybrid: true,
    scrollOverflow: true,
    direction: 'vertical',
  });



/*

name of folder where pics are located

*/
//--------------------------------------------------------
var directory = 'data';


/*

call api and get chips of users (right below where you put email)

*/
//--------------------------------------------------------

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




/*

Animations to fade in and fade out

*/
//--------------------------------------------------------

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


/*

when enter is pressed while inputing email, the submit button will be triggered

*/
//--------------------------------------------------------

$('.loginEmail').keypress(function (e) {
    if (e.which == 13) {
      $('.loginSubmit').click();
      return false;
    }
  });


/*

when the submit button next to email is clicked, we populate the annotation hub and scroll down to it

*/
//--------------------------------------------------------

$('.loginSubmit').click(function (event) {
    if ($('.loginEmail').val().length !== 0) {
      setupAnnotateHub();
    } else {
      fadeIn('.loginAlert');
    }
  });


/*

or if we just click on a user chip, we populate the annotation hub and scroll down to it

*/
//--------------------------------------------------------

$('body').on('click', '.chip', function () {
    setupAnnotateHub();
    $('.loginEmail').val($(this).text());
  });




/*

we display the annotation hub, refresh the most recent submission table, and call populateMediaAndOptions

*/
//--------------------------------------------------------

function setupAnnotateHub() {
  $('section:nth-child(2)').css('display', 'block');

  refreshTable();
  populateMediaAndOptions();
  fadeIn('.annotate');

  $(document).ajaxStop(function () {
      $('.main').moveDown();
  });

}


/*

use this function to load the feature checkboxes and run checkOut(); to get the picture

*/
//--------------------------------------------------------
function populateMediaAndOptions() {

    $.ajax({
        type: 'GET',
        url: 'http://kitelore.com/api.php',
        data: 'request=featureList',
        success: function(data) {
            $('.optionBucket').html(data);
        },

        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            console.log('ajax error response type ' + type);
        },
    });
    checkOut();

}



/*

get the picture from the server by looking up what was the last submitted picture.
each picture is numbered, meaning the next picture to be loaded will be the last submited picture name + 1


*/
//--------------------------------------------------------

var checkedOut;

function checkOut() {

    $.ajax({
        type: 'GET',
        url: 'http://kitelore.com/api.php',
        data: 'request=checkOut',
        success: function(data) {
            if (data === '') {
                data = 0;
            }

            checkedOut = parseInt(data) + 1;
            var progressBarValue = ((checkedOut * 100 / 10) + '%');
            $('.img-subject').attr('src', directory + '/' + checkedOut + '.jpg');
            $('.progress-bar').css('width', progressBarValue);

        },

        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            console.log('ajax error response type ' + type);
        },
    });

}




/*

when hovering over the image, show live postion, and when clicked, capture it


*/
//--------------------------------------------------------

$('.img-subject').click(function(e) {
    var parentOffset = $(this).offset();
    $('.dataX').html((((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3) + ' %');
    $('.dataY').html((((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3) + ' %');
});

$('.img-subject').mousemove(function(e) {
    var parentOffset = $(this).offset();
    var relativeXPosition = (((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3);
    var relativeYPosition = (((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3);
    $('.livePosition').html(relativeXPosition + ' %' + ', ' + relativeYPosition + ' %');
});



/*

  refresh table by calling the data base (api)


  */
//--------------------------------------------------------

function refreshTable() {
    $.ajax({
        type: 'GET',
        url: 'http://kitelore.com/api.php',
        data: 'request=getTable',
        success: function(data) {
            $('.table-bordered').html(data);
        },

        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            console.log('ajax error response type ' + type);
        },
    });
}





/*

  submit to database by aggreating the input/div values into dataComplete.
  Push to database, and call refreshTable and populateMediaAndOptions


  */
//--------------------------------------------------------

$('.annotateSubmit').click(function(event) {

    var dataComplete = [];

    dataComplete.push({
        user: $('.loginEmail').val()
    });
    dataComplete.push({
        x: $('.dataX').text(),
        y: $('.dataY').text()
    });
    dataComplete.push({
        pic_id: checkedOut
    });

    $('.optionBucket input[type="checkbox"]').each(function(index, ez) {
        var element = $(this).attr('val');
        var data = $(this).is(':checked');
        dataComplete.push({
            feature: element,
            status: data * 1
        });
    });

    $.ajax({
        type: 'POST',
        url: 'http://kitelore.com/api.php',
        data: 'request=submitAnnotation&data=' + JSON.stringify(dataComplete),
        success: function(data) {
            refreshTable();
            populateMediaAndOptions();
        },

        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            console.log('ajax error response type ' + type);
        },
    });

});
