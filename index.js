require('es6-promise').polyfill();
require('isomorphic-fetch');
const config = require('./config')


// import express
const express = require('express');
const session = require('express-session')({
  secret: 'top_secret',
  resave: true,
  saveUninitialized: true,
})

// import passport library
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

console.log(config.AUTHORIZATION_URL);
console.log(config.TOKEN_URL);

// setup passport
passport.use(new OAuth2Strategy({
    authorizationURL: config.AUTHORIZATION_URL,
    tokenURL: config.TOKEN_URL,
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.APPLICATION_URL + "/callback",
    scope: ["results:read"],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile);
    cb(null, {
      "access_token": accessToken
    });
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// initialize app
const app = express();
const typeformHandlers = new(require('./TypeformHandlers'))(config.TYPEFORM_API_BASE_URL, config.DEFAULT_FORM_ID);

// view engine setup
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// initialize session
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const authenticator = passport.authenticate('oauth2', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/'
})

const require_authentication = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.url;
    return res.redirect('/login');
  }

  next();
}

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup handlers
var routes = require('./routes/index');

app.get('/login', authenticator);
app.get('/callback', authenticator);
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/', typeformHandlers.indexHandler);
// app.post('/invite', require_authentication, slackHandlers.inviteHandler);
app.use('/', require_authentication, routes);

app.listen(config.MY_PORT, config.MY_HOST, function () {
  console.log(`Running on http://${config.MY_ADDR}`);
})
