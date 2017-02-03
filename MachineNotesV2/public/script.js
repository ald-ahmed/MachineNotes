
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
    url: '/users',
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
  $(element).css('display', 'block');
  $(element).addClass('animated');
  $(element).css('visibility', 'visible');
  $(element).addClass('fadeIn');
}

function fadeOut(element) {
  $(element).addClass('animated');
  $(element).addClass('fadeOut');
  $(element).css('visibility', 'hidden');
  $(element).css('display', 'none');

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

  $(document).ajaxStop(function () {

      $('.login').fadeOut('fast', function () {
        fadeIn('.annotate');
      });

    });

}


/*

use this function to load the feature checkboxes and run checkOut(); to get the picture

*/
//--------------------------------------------------------
function populateMediaAndOptions() {

  $.ajax({
      type: 'GET',
      url: 'features',
      success: function (data) {
          var tmpl = $.templates("#featureTemplate");
          $(".optionBucket").html(tmpl.render(data));
          checkOut();
        },

      error: function (xhr, type, exception) {
          populateMediaAndOptions();
          console.log('ajax error response type ' + type);
        },
    });

}

/*

get the picture from the server by looking up what was the last submitted picture.
each picture is numbered, meaning the next picture to be loaded will be the last submitted picture name + 1


*/
//--------------------------------------------------------

var checkedOut;

function checkOut() {

  $.ajax({
      type: 'GET',
      url: 'checkout',
      success: function (data) {

          $('.img-subject').attr('src', directory + '/' + data);

          //var progressBarValue = ((checkedOut * 100 / 500000) + '%');
          //$('.progress-bar').css('width', progressBarValue);

        },

      error: function (xhr, type, exception) {
          // if ajax fails display error alert
          console.log('ajax error response type ' + type);
        },
    });

}

function checkOutSpecific(id) {
  id = parseInt(id);
  var progressBarValue = ((id * 100 / 10) + '%');
  $('.img-subject').attr('src', directory + '/' + id + '.jpg');
  $('.progress-bar').css('width', progressBarValue);
  checkedOut = id;
}


/*

when hovering over the image, show live position, and when clicked, capture it

*/
//--------------------------------------------------------

$('.img-subject').click(function (e) {
    var parentOffset = $(this).offset();
    $('.dataX').html((((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3) + ' %');
    $('.dataY').html((((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3) + ' %');
  });


  $('.removePosition').click(function (e) {
      $('.dataX').html('');
      $('.dataY').html('');
    });

$('.img-subject').mousemove(function (e) {
    var parentOffset = $(this).offset();
    var relativeXPosition = (((e.pageX - parentOffset.left) / $(this).width()) * 100).toFixed(3);
    var relativeYPosition = (((e.pageY - parentOffset.top) / $(this).height()) * 100).toFixed(3);
    $('.livePosition').html(relativeXPosition + ' %' + ', ' + relativeYPosition + ' %');
  });



/*

  refresh table by calling the database (api)


  */
//--------------------------------------------------------

function refreshTable() {
  $.ajax({
      type: 'GET',
      url: 'table',
      success: function (data) {

          for (var entry in data){
              $(".table-bordered").prepend("<pre>"+data[entry].basicInfo.user+"</pre>");

          }

          $('.removePosition').click();
        },

      error: function (xhr, type, exception) {
          // if ajax fails display error alert
          console.log('ajax error response type ' + type);
        },
    });
}

var tempCheck = -1;
$('body').on('click', '.deleteRow', function () {

      $.ajax({
          type: 'GET',
          url: '',
          data: 'request=delete&data=' + this.id,
          success: function (data) {
              tempCheck =  checkedOut;
              checkOutSpecific(data);
              refreshTable();
            },

          error: function (xhr, type, exception) {
              // if ajax fails display error alert
              console.log('ajax error response type ' + type);
            },
        });

    });



/*

  submit to database by aggregating the input/div values into dataComplete.
  Push to database, and call refreshTable and populateMediaAndOptions


  */
//--------------------------------------------------------

$('.annotateSubmit').click(function (event) {



    var basicInfo ={};

    basicInfo.user=  $('.loginEmail').val();
    basicInfo.pic_id=  checkedOut;

    var positionData = {};
    positionData.x=  $('.dataX').text();
    positionData.y=  $('.dataY').text();

    console.log(positionData);
    var featureAnnotations = {};

    $('.optionBucket input[type="checkbox"]').each(function (index, ez) {
        var element = $(this).attr('name');
        var data = $(this).is(':checked');
        featureAnnotations[element] = data * 1;
    });

    var dataComplete = {basicInfo,positionData,featureAnnotations};

    $.ajax({
        type: 'POST',
        url: 'insert',
        dataType: 'json',
        headers : {
            'Content-Type' : 'application/json'
        },
        data: JSON.stringify(dataComplete),

        success: function () {

            //refreshTable();
            if (tempCheck != -1) {
                checkedOut = tempCheck;
            }
            //populateMediaAndOptions();
        },
        error: function (xhr, type, exception) {
            // if ajax fails display error alert
            console.log('ajax error response type ' + type);
        },
    });


});
