const express = require('express');

module.exports = (request) => ({
  hookRoute(path) {
    const router = express.Router();
    require(path)(router);
    return router;
  },
  generateText(maxLength) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";

    for (var i = 0; i < maxLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  registerAndLoginPartner(uid, password) {
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
      .then(res => Promise.resolve(res.body.token))
      .catch(err => Promise.reject(err));
  },
  login: (email, password) =>
    request.post('/auth/login').send({
      email,
      password
    }).expect(200)
    .then(res => Promise.resolve(res.body.token))
    .catch(err => Promise.reject(err)),

  makeAuthRequest(verb, url, token, body, expectationCode, responseField) {
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
  },
  newChallenge(options, token) {
    options = options || {};
    return testUtil.makeAuthRequest('post', '/api/challenges', token, {
      title: options.title || this.generateText(101),
      expiresAt: moment().add(2, 'days').toDate(),
      video: options.video || {
        originalUrl: this.generateText(101),
        thumbnails: [this.generateText(101), this.generateText(101)]
      },
      prizes: options.prizes || [{
        title: this.generateText(101)
      }],
    });
  },
  newChallenges(nunberOfChallenges, token) {
    return Promise.all([...Array(nunberOfChallenges).keys]
      .map(() => {
        return this.newChallenge(null, token);
      }))
      .then(challenges => challenges.map(c => c._id));
  },
  joinChallenge(options, token) {
    options = options || {};
    const userIds = [].concat(options.userIds || 'testid');
    return userIds.reduce((promise, userId) => {
      return promise.then(() => {
        return testUtil.makeAuthRequest('post', `/api/challenges/${options.challengeId}/join`, token, {
          user: {
            id: userId
          }
        });
      });
    }, Promise.resolve());
  },
});