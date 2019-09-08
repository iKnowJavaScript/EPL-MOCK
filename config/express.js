const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const expressWinston = require('express-winston');
const helmet = require('helmet');

const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

const winstonInstance = require('./winston');
const routes = require('../api/routes');
const error = require('./error');
const { env, REDIS_SECRET } = require('./env');

const app = express();

// start redis connect
redisClient.on('error', err => {
  console.log('Redis error: ', err);
});

app.use(
  session({
    secret: REDIS_SECRET,
    name: 'epl_redis',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })
  })
);

// secure apps by setting various HTTP headers
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// parse body params and attach them to res.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// enable detailed API logging in dev env
//comment this code to reduce api logs
if (env === 'development') {
  app.use(logger('dev'));
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  );
}

// mount all routes on /api path
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

if (env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance
    })
  );
}

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
