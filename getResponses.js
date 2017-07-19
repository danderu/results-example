const getResponsesUrl = formId => `https://api.challenge.typeform.com/forms/${formId}/responses`

module.exports = function getResponses(formId, token) {
  return new Promise((resolve, reject) => {
    const headers = new Headers({
      'Authorization': `Bearer ${token}`
    })
    fetch(getResponsesUrl(formId), { headers })
    .then((response) => {
      if (response.status >= 400) {
        console.error("Bad response from server", response.status, response.statusText)
        reject("Bad response from server");
      }
      return response.json();
    })
    .then((responses) => {
      resolve(responses);
    });
  })
}
  // const headers = new Headers({
  //   'Authorization': `Bearer ${token}`
  // })

  // const response = await fetch(getResponsesUrl(formId), { headers })
  // console.log(formId, token, response.json())
  // if (response.status >= 400) {
  //     throw new Error(`Bad response from server. Status: ${response.status} - ${response.statusText}`);
  // }
  // return response.json()

// /*
// curl -X POST \
//   https://api.challenge.typeform.com/applications \
//   -H 'authorization: Bearer QsZb0AH1pbFxgDZu4Uvx1NJW8vemrw_Q-LgpEJ8feII=' \
//   -d '{
//   "name": "Slacker"
// }'
// */

// /*
// {"client_id":"5iw27NZj5ia9Vz1gRk2ogE4dXYyTyEl5CQu--xi6CDY=","client_secret":"PbY97dcrr4v3_NnFbKF-qp8bTe1S7e_RwWOsy--WMGc=","name":"Slacker","description":"","homepage_url":"","allowed_redirect_uris":null}
// */

// /*
//   [ ] - authenticate
//   [ ] - get responses
//   [ ] - return results
//   //   'Authorization': 'Bearer b16c979510243beabeb07666001e9d7d16e2df47'
// */
// module.exports = async function getResponses({formId}) {
//   console.log(getResponsesUrl(formId))
//   const response = await fetch(getResponsesUrl(formId))
//   if (response.status >= 400) {
//     throw new Error(`Bad response from server. Status: ${response.status} - ${response.statusText}`);
//   }
//   return response.json();
// }
