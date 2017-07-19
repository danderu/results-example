const getResponses = require('./getResponses')

module.exports = class SlackHandlers {
  constructor (slackToken, slackUrl, inviteToken, community) {
    this.slackToken = slackToken
    this.slackUrl = slackUrl
    this.inviteToken = inviteToken
    this.community = community
    
    this.inviteHandler = this.inviteHandler.bind(this);
  }

  inviteHandler(req, res) {
    if (req.body && (!this.inviteToken || (!!this.inviteToken && req.body.token === this.inviteToken))) {
      Object.keys(req.body).filter(e => !!e).forEach(email => {
        fetch('https://'+ this.slackUrl + '/api/users.admin.invite', {
          method: 'POST',
          body: {
            email: email,
            token: this.slacktoken,
            set_active: true
          }
        })
        .then(response => {
          if (response.status >= 400) {
            console.error("Bad response from server", response.status, response.statusText)
            res.send("Bad response from server");
          }
          return response.json();
        })
        .then((responses) => {
          res.render('result', {
            community: this.community,
            message: 'Success! Check &ldquo;'+ email +'&rdquo; for an invite from Slack.'
          });
        });
      })
    }
  }
}
