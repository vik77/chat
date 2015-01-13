var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var config = require('./config');
var routes = require('./routes');
var users = require('./routes/user');
var reg = require('./routes/reg');
var checkAuth = require('./utils/checkAuth');
var auth = require('./routes/auth');
var chat = require('./routes/chat');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//insert data
/*var Maintext = require('../models/maintexts').maintext;
var maintext = new Maintext (
{
  name: 'Главная',
  body: 'Добро пожаловать на сайт',
  url: 'index'
}
);
maintext.save (function(err, user) {
  console.log('Ok');
});
var maintext = new Maintext (
{
  name: 'Древняя Греция',
  body: 'Древняя Греция ТЕКСТ',
  url: 'ancient_greece'
}
);
maintext.save (function(err, user) {
  console.log('Ok');
});
var maintext = new Maintext (
{
  name: 'Древний Рим',
  body: 'Древний Рим ТЕКСТ',
  url: 'ancient_rome'
}
);
maintext.save (function(err, user) {
  console.log('Ok');
});
var maintext = new Maintext (
{
  name: 'Словарик',
  body: 'Словарик ТЕКСТ',
  url: 'glossary'
}
);
maintext.save (function(err, user) {
  console.log('Ok');
});
var maintext = new Maintext (
{
  name: 'Источники',
  body: 'Источники ТЕКСТ',
  url: 'information_sources'
}
);
maintext.save (function(err, user) {
  console.log('Ok');
});*/
//end

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.bodyParser({
  keepExtentions : true,
  uploadDir : 'public/tmp'
}));

app.use(express.session({
  secret : 'abc123',
  key : 'sid'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use( function(req, res, next) {
  res.locals = {
    userid : req.session.user
  };
  next();
});
app.use(app.router);

// Слушатели
app.get('/', routes.index);
app.get('/users', users.list);
app.get('/reg', reg.index)
app.get('/cabinet', checkAuth, auth.cabinet);
app.get('/logout', checkAuth, reg.logout);
app.get('/chat', chat.index);
app.get('/:id', routes.index);

app.post('/reg', reg.send);
app.post('/cabinet', checkAuth, auth.send);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(config.get('port'), function(){
  console.log('listening on:' + config.get('port'));
});

//app.listen(3000);
//app.listen(config.get('port'));

module.exports = app;
