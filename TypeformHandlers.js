const fetch = require('node-fetch');
const getResponses = require('./getResponses')

module.exports = class TypeformHandlers {
  constructor (typeform_api_url, default_form_id) {
      this.TYPEFORM_API_URL = typeform_api_url;
      this.DEFAULT_FORM_ID = default_form_id;

      this.indexHandler = this.indexHandler.bind(this);
  }

  indexHandler(req, res) {
    if (!req.isAuthenticated()) {
      return res.render('anonymous', {
        community: process.env.COMMUNITY_NAME || 'The Pillows Team',
        tokenRequired: !!process.env.INVITE_TOKEN || null
      })
    }

    if (this.DEFAULT_FORM_ID) {
      return res.redirect(`/results/${this.DEFAULT_FORM_ID}`);
    }

    return getResponses('CQic7l', req.user.access_token)
      .then(data => {
        const emails = data.items.map(item => {
          if (item.answers) {
            if (item.answers[0].type == "email") {
              return item.answers[0].email
            }
          }
        })
        return res.render('authenticated', {
          community: process.env.COMMUNITY_NAME || 'The Pillows Team',
          tokenRequired: !!process.env.INVITE_TOKEN || null,
          emails
        })
      })
  }
}
