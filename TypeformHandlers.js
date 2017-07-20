const fetch = require('node-fetch');
const getResponses = require('./getResponses')
const getForms = require('./getForms')

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
  }

  formHandler(req, res) {
    return getForms(req.user.access_token)
      .then(forms => {
        return res.render('form', {
          community: process.env.COMMUNITY_NAME || 'The Pillows Team',
          forms
        })
      })
  }

  submitHandler(req, res) {
    return getResponses(req.query.formId, req.user.access_token)
      .then(data => {
        const emails = data.items.map(item => {
          if (item.answers) {
            if (item.answers[0].type == "email") {
              return item.answers[0].email
            }
          }
        })
        return res.render('invites', {
          community: process.env.COMMUNITY_NAME || 'The Pillows Team',
          tokenRequired: !!process.env.INVITE_TOKEN || null,
          emails
        })
      })
  }
}
