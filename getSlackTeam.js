const config = require('./config')

module.exports = async function getSlackTeam(code) {
  const token = await getSlackToken(code)
  console.log('token', token)
  return new Promise((resolve, reject) => {
    fetch(`https://slack.com/api/team.info?token=${token}`)
      .then(response => {
        if (response.status >= 400) {
          console.error("Bad response from server", response.status, response.statusText)
          reject("Bad response from server");
        }
        return response.json();
      })
      .then(response => {
        resolve(response.team)
      })
  })
}

function getSlackToken(code) {
  console.log('SLACK CLIENT ID', config.SLACK_CLIENT_ID)
  console.log('SLACK CLIENT SECRET', config.SLACK_CLIENT_SECRET)
  return new Promise((resolve, reject) => {
    // request token
    fetch(`https://slack.com/api/oauth.access?code=${code}&client_id=${config.SLACK_CLIENT_ID}&client_secret=${config.SLACK_CLIENT_SECRET}`)
      .then(response => {
        if (response.status >= 400) {
          console.error("Bad response from server", response.status, response.statusText)
          reject("Bad response from server");
        }
        return response.json();
      })
      .then(response => {
        console.log('response token', response)
        resolve(response.access_token)
      })
  })
}
