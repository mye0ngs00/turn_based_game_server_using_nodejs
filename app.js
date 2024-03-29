const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const session = require('express-session');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);

const dbOptions = require('./configs/dbConfig');
const dbSecret = require('./configs/dbSecretKey');

const indexRouter = require('./routes/index');
const lobbyRouter = require('./routes/lobby');
const roomRouter = require('./routes/room');
const signRouter = require('./routes/sign');

const app = express();

require('./controllers/war_using_socket')(app);
require('./controllers/queue_manager')(app);

// rdb connection.
app.conn = mysql.createConnection(dbOptions);

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
app.use(require('./controllers/ip-logger')());
app.use('/', indexRouter);

//큐 연결 구현해야함.
app.use('/lobby', lobbyRouter);
app.use('/room', roomRouter);
app.use('/sign', signRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
