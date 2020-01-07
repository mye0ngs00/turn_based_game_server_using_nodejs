const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const dbOptions = require('./configs/dbConfig');
const dbSecret = require('./configs/dbSecretKey');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const lobbyRouter = require('./routes/lobby');
const roomRouter = require('./routes/room');
const signRouter = require('./routes/sign');
const usersRouter = require('./routes/users');

const app = express();

// rdb connection.
app.conn = mysql.createConnection(dbOptions);

// webSocket connection.
app.io = require('socket.io')();
require('./routes/war_using_socket')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: dbSecret,
  store: new MySQLStore(dbOptions),
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lobby', lobbyRouter);
app.use('/room', roomRouter);
app.use('/sign', signRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
