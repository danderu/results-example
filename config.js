const url = require('url');
function die(msg, code) {
  console.log(msg)
  if (code === undefined) {
    code = -1
  }

  process.exit(code)
}

const TYPEFORM_API_BASE_URL = process.env.TYPEFORM_API_BASE_URL || die("Missing 'TYPEFORM_API_BASE_URL' environment variable.");
const AUTHORIZATION_URL = url.resolve(TYPEFORM_API_BASE_URL, '/oauth/authorize');
const TOKEN_URL = url.resolve(TYPEFORM_API_BASE_URL, '/oauth/token');

const APPLICATION_URL = process.env.APPLICATION_URL || die("Missing 'APPLICATION_URL' environment variable.");

const CLIENT_ID = process.env.CLIENT_ID || die("Missing 'CLIENT_ID' environment variable.");
const CLIENT_SECRET = process.env.CLIENT_SECRET || die("Missing 'CLIENT_SECRET' environment variable.");

const DEFAULT_FORM_ID = process.env.DEFAULT_FORM_ID;

// =slack input
const COMMUNITY_NAME = process.env.COMMUNITY_NAME || die("Missing 'COMMUNITY_NAME' environment variable.");
const SLACK_URL = process.env.SLACK_URL || die("Missing 'SLACK_URL' environment variable.");
const SLACK_TOKEN = process.env.SLACK_TOKEN || die("Missing 'SLACK_TOKEN' environment variable.");
const INVITE_TOKEN = process.env.INVITE_TOKEN || null;

const MY_HOST = '0.0.0.0';
const MY_PORT = process.env.PORT || 5000;
const MY_ADDR = `${MY_HOST}:${MY_PORT}`;

module.exports = {
  TYPEFORM_API_BASE_URL,
  AUTHORIZATION_URL,
  TOKEN_URL,
  APPLICATION_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  DEFAULT_FORM_ID,
  COMMUNITY_NAME,
  SLACK_URL,
  SLACK_TOKEN,
  INVITE_TOKEN,
  MY_HOST,
  MY_PORT,
  MY_ADDR
}
