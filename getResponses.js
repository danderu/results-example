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
