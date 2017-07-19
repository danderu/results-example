require('es6-promise').polyfill();
require('isomorphic-fetch');

// yeah, let's start with that :)
function die(msg, code) {
  console.log(msg);
  if (code === undefined) {
    code = -1;
  }

  process.exit(code);
}

const url = require('url');

// input
const TYPEFORM_API_BASE_URL = process.env.TYPEFORM_API_BASE_URL || die("Missing 'TYPEFORM_API_BASE_URL' environment variable.");
const AUTHORIZATION_URL = url.resolve(TYPEFORM_API_BASE_URL, '/oauth/authorize');
const TOKEN_URL = url.resolve(TYPEFORM_API_BASE_URL, '/oauth/token');

const APPLICATION_URL = process.env.APPLICATION_URL || die("Missing 'APPLICATION_URL' environment variable.");

const CLIENT_ID = process.env.CLIENT_ID || die("Missing 'CLIENT_ID' environment variable.");
const CLIENT_SECRET = process.env.CLIENT_SECRET || die("Missing 'CLIENT_SECRET' environment variable.");

const DEFAULT_FORM_ID = process.env.DEFAULT_FORM_ID;

// slack input
const COMMUNITY_NAME = process.env.COMMUNITY_NAME || die("Missing 'COMMUNITY_NAME' environment variable.");
const SLACK_URL = process.env.SLACK_URL || die("Missing 'SLACK_URL' environment variable.");
const SLACK_TOKEN = process.env.SLACK_TOKEN || die("Missing 'SLACK_TOKEN' environment variable.");
const INVITE_TOKEN = process.env.INVITE_TOKEN || null;


const MY_HOST = '0.0.0.0';
const MY_PORT = process.env.PORT || 5000;
const MY_ADDR = `${MY_HOST}:${MY_PORT}`


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

console.log(AUTHORIZATION_URL);
console.log(TOKEN_URL);

// setup passport
passport.use(new OAuth2Strategy({
    authorizationURL: AUTHORIZATION_URL,
    tokenURL: TOKEN_URL,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: APPLICATION_URL + "/callback",
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
const typeformHandlers = new(require('./TypeformHandlers'))(TYPEFORM_API_BASE_URL, DEFAULT_FORM_ID);
const slackHandlers = new(require('./SlackHandlers'))(SLACK_TOKEN, SLACK_URL, INVITE_TOKEN, COMMUNITY_NAME)

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
app.get('/login', authenticator);
app.get('/callback', authenticator);
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/', typeformHandlers.indexHandler);
app.post('/invite', require_authentication, slackHandlers.inviteHandler);

app.listen(MY_PORT, MY_HOST, function () {
  console.log(`Running on http://${MY_ADDR}`);
})
