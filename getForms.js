module.exports = function getForms(token) {
  return new Promise((resolve, reject) => {
    const headers = new Headers({
      'Authorization': `Bearer ${token}`
    })
    fetch('https://api.challenge.typeform.com/forms', { headers })
    .then((response) => {
      if (response.status >= 400) {
        console.error("Bad response from server", response.status, response.statusText)
        reject("Bad response from server");
      }
      return response.json();
    })
    .then((response) => {
      resolve(response);
    });
  })
}
