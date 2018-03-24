const express = require('express');

module.exports = (request) => ({
  hookRoute: (path) => {
    const router = express.Router();
    require(path)(router);
    return router;
  },

  registerAndLoginPartner: (uid, password) => {
    return request.post('/auth/register').send({
      uid,
      firstName: 'test first name',
      lastName: 'test last name',
      password,
    })
    .expect(200)
    .then(() => request.post('/auth/login').send({
      uid,
      password: password
    }).expect(200))
    .then(res =>  Promise.resolve(res.body.token))
    .catch(err => Promise.reject(err));
  },
  login: (email, password) =>
    request.post('/auth/login').send({
      email,
      password
    }).expect(200)
    .then(res =>  Promise.resolve(res.body.token))
    .catch(err => Promise.reject(err)),

  makeWebRequest: (verb, url, token, body, expectationCode, responseField) => {
    const newVerb = verb.toLowerCase();
    let req = request[verb](url);
    if (token) {
      req = req.set('Authorization', token);
    }
    if (newVerb === 'get') {
      return req.expect(expectationCode || 200)
      .then(res => res[responseField || 'body']);
    }
    return req.send(body || {})
    .expect(expectationCode || 200)
    .then(res => res.body);
  }
});
