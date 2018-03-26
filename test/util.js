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
    log.debug('creating a new challenge');
    options = options || {};
    return testUtil.makeAuthRequest('post', `/api/shows/${options.showId}/challenges`, token, {
      title: options.title || this.generateText(101),
      expiresAt: moment().add(2, 'days').toDate(),
      prizes: options.prizes || [{
        title: this.generateText(101)
      }],
    });
  },
  newShow(options, token) {
    log.debug('creating a new show');
    options = options || {};
    return testUtil.makeAuthRequest('post', '/api/shows', token, {
      title: options.title || this.generateText(101),
      video: options.video || {
        originalUrl: this.generateText(101),
        thumbnails: [this.generateText(101), this.generateText(101)]
      }
    });
  },
  newChallenges(numberOfChallenges, showId, token) {
    log.debug(`creating ${numberOfChallenges} challenge(s) for show ${showId}`);
    return Promise.all([...Array(numberOfChallenges).keys()]
      .map(() => {
        return this.newChallenge({ showId }, token);
      }))
      .then(challenges => challenges.map(c => c._id));
  },
  joinChallenge(options, token) {
    options = options || {};
    const userIds = [].concat(options.userIds || 'testid');
    log.debug(`joining challenge without submitting video for ${userIds.length} user(s) in challenge ${options.challengeId}`);
    return userIds.reduce((promise, userId) => {
      return promise.then(() => {
        return testUtil.makeAuthRequest('post', `/api/shows/${options.showId}/challenges/${options.challengeId}/join`, token, {
          user: {
            id: userId
          }
        });
      });
    }, Promise.resolve());
  },
  joinChallengeWithVideo(options, token) {
    options = options || {};
    const userIds = [].concat(options.userIds || 'testid');
    log.debug(`joining challenge and submitting video for ${userIds.length} user(s) in challenge ${options.challengeId}`);
    return userIds.reduce((promise, userId) => {
      return promise.then(() => {
        return testUtil.makeAuthRequest('post', `/api/shows/${options.showId}/challenges/${options.challengeId}/join`, token, {
          user: {
            id: userId
          },
          video: {
            originalUrl: this.generateText(101)
          }
        });
      });
    }, Promise.resolve());
  },
  likeSubmission(options, token) {
    options = options || {};
    const userIds = [].concat(options.userIds || 'testid');
    log.debug(`${userIds.length} user(s) is(are) voting for submission ${options.submissionId} of challenge ${options.challengeId}`);
    return userIds.reduce((promise, userId) => {
      return promise.then(() => {
        return testUtil.makeAuthRequest('post', `/api/shows/${options.showId}/challenges/${options.challengeId}/submissions/${options.submissionId}/like`, token, {
          user: {
            id: userId
          }
        });
      });
    }, Promise.resolve());
  }
});