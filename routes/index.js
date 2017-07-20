const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config')

router.post('/invite', function(req, res) {
  if (req.body && (!config.INVITE_TOKEN || (!!config.INVITE_TOKEN && req.body.token === config.INVITE_TOKEN))) {
    Object.keys(req.body).filter(key => !!req.body[key])
      .forEach(key => {
        request.post({
          url: 'https://'+ config.SLACK_URL + '/api/users.admin.invite',
          form: {
            email: req.body[key],
            token: config.SLACK_TOKEN,
            set_active: true
          }
        }, function(err, httpResponse, body) {
          console.log(body)
          // body looks like:
          //   {"ok":true}
          //       or
          //   {"ok":false,"error":"already_invited"}
          if (err) { return res.send('Error:' + err); }
          body = JSON.parse(body);
          if (body.ok) {
            res.render('result', {
              community: config.community,
              message: 'Success! Check &ldquo;'+ req.body[key] +'&rdquo; for an invite from Slack.'
            });
          } else {
            var error = body.error;
            if (error === 'already_invited' || error === 'already_in_team') {
              res.render('result', {
                community: config.community,
                message: 'Success! You were already invited.<br>' +
                          'Visit <a href="https://'+ config.slackUrl +'">'+ config.community +'</a>'
              });
              return;
            } else if (error === 'invalid_email') {
              error = 'The email you entered is an invalid email.';
            } else if (error === 'invalid_auth') {
              error = 'Something has gone wrong. Please contact a system administrator.';
            }

            res.render('result', {
              community: config.community,
              message: 'Failed! ' + error,
              isFailed: true
            });
          }
        });
      })
    
  } else {
    var errMsg = [];
    if (!req.body[key]) {
      errMsg.push('your email is required');
    }

    if (!!config.inviteToken) {
      if (!req.body.token) {
        errMsg.push('valid token is required');
      }

      if (req.body.token && req.body.token !== config.inviteToken) {
        errMsg.push('the token you entered is wrong');
      }
    }

    res.render('result', {
      community: config.community,
      message: 'Failed! ' + errMsg.join(' and ') + '.',
      isFailed: true
    });
  }
});

module.exports = router;
