var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static('data'));


// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb');


var annotationsDB = new Datastore({ filename: path.join(__dirname, 'annotations.db'), autoload: true });
var checkoutDB = new Datastore({ filename: path.join(__dirname, 'checkout.db'), autoload: true });



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.get('/users', function(req, res, next) {
    annotationsDB.find({},function (err,docs) {
        res.send(docs);
    });
});




function checkOutItem(items,index,callback) {

    var item = items[index];
    console.log(item);
    checkoutDB.findOne({file:item}, function (err, docs) {
        if (!docs) {
            console.log(item, " not checkedout");
            checkoutDB.insert({file:item});
            callback(item);
            return item;

        }
        else {
            checkOutItem(items,index+1,callback);
        }
    });

}


app.get('/checkout', function(req, res, next) {

    var dataPath = 'data';
    var newCheckout;
    fs.readdir(dataPath, function(err, items) {
        checkOutItem(items,0 ,function (item) {
            res.send(item);
        });
    });

});


//return content of the file features.json
app.get('/features', function(req, res, next) {

    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('features.json', 'utf8'));
    res.send(obj);

});

app.post('/insert', function(req, res, next) {

    var data = req.body;
    console.log(data);

    annotationsDB.insert(data,function (err,docs) {
        console.log(err);
        annotationsDB.find({},function (err,docs) {
            console.log(docs);
        })
    });

    res.render('index', { title: 'Express' });
});

app.get('/table', function(req, res, next) {
    annotationsDB.find({},function (err,docs) {

        res.send(docs);
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var listener = app.listen(8080, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 80
});

module.exports = app;
