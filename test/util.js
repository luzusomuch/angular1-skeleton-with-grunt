const express = require('express');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

module.exports = (request) => ({
  hookRoute: (path) => {
    const router = express.Router();
    require(path)(router);
    return router;
  },

  registerAndVerifyAndLogin: (email, password) => {
    sinon.spy(Services.Email, 'send');
    return request.post('/auth/register').send({
      email,
      firstName: 'test first name',
      lastName: 'test last name',
      countryCode: '+1',
      phone: '123456'
    })
    .expect(200)
    .then(() => {
      const args = Services.Email.send.getCall(0).args;
      const token = args[0].locals.verificationCode;
      Services.Email.send.restore();
      return request.post(`/auth/verify/${token}`).send({
        password: password || 'password'
      }).expect(200);
    })
    .then(() => request.post('/auth/login').send({
      email,
      password: password || 'password'
    }).expect(200))
    .then(res =>  Promise.resolve(res.body.token))
    .catch(err => Promise.reject(err));
  },
  registerAndVerify: (email, password) => {
    sinon.spy(Services.Email, 'send');
    return request.post('/auth/register').send({
      email,
      firstName: 'test first name',
      lastName: 'test last name',
      countryCode: '+1',
      phone: '123456'
    })
    .expect(200)
    .then((res) => {
      const args = Services.Email.send.getCall(0).args;
      const token = args[0].locals.verificationCode;
      Services.Email.send.restore();
      return request.post(`/auth/verify/${token}`).send({
        password: password || 'password'
      }).expect(200).then(() => res.body);
    });
  },
  login: (email, password) =>
    request.post('/auth/login').send({
      email,
      password
    }).expect(200)
    .then(res =>  Promise.resolve(res.body.token))
    .catch(err => Promise.reject(err)),

  generateText: (maxLength) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";

    for (var i = 0; i < maxLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  makeAuthRequest: (verb, url, token, body, expectationCode, responseField) => {
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
  newProject: (token, options) => 
    testUtil.makeAuthRequest('post', '/api/projects', token, options || { title: 'test project' }),

  newTestSuite: (projectId, token, options) => 
    testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testsuites`, token, 
      options || { 
        title: testUtil.generateText(101),
        description: testUtil.generateText(101)
      }),
  newComponent: (projectId, testSuiteId, token, options) =>
    testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testsuites/${testSuiteId}/components`, token, 
    options || { 
      title: testUtil.generateText(101),
      description: testUtil.generateText(101)
    }),
  newTestCase: (projectId, testSuiteId, componentId, token, options) => 
    testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testsuites/${testSuiteId}/components/${componentId}/testcases`, token, 
    options || { 
      title: testUtil.generateText(101),
      description: testUtil.generateText(101),
    }),
  newStep: (projectId, testSuiteId, componentId, testCaseId, token, options) => 
    testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testsuites/${testSuiteId}/components/${componentId}/testcases/${testCaseId}/steps`, token, 
    options || { 
      title: 'test step',
      description: 'test step',
    }),
  newStepForIssue: (projectId, testRunId, testCaseId, issueId, token, options) => {
    const apiUrl = (testCaseId) ? `/api/projects/${projectId}/testruns/${testRunId}/testcases/${testCaseId}/issues/${issueId}/steps` : `/api/projects/${projectId}/testruns/${testRunId}/issues/${issueId}/steps`;
    return testUtil.makeAuthRequest('post', apiUrl, token, 
    options || { 
      title: testUtil.generateText(101),
      description: testUtil.generateText(101)
    });
  },  
  newTestRun: (projectId, token, options) => {
    options = options || {};
    const newOptions = {
      title: options.title || 'test run',
      description: options.description || 'test run',
      browsersOrOses: options.browsersOrOses,
      devicesOrEnvironments: options.devicesOrEnvironments
    };
    return testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testruns`, token, newOptions);
  },
  newIssue: (projectId, testRunId, testCaseId, token, options) => {
    options = options || {};
    const newOptions = {
      title: options.title || 'issue',
      description: options.description || 'test issue',
      severity: options.severity || 'major'
    };
    return testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testruns/${testRunId}/testcases/${testCaseId}/issues`, token, newOptions);
  },
  newIssueWithoutTestCase: (projectId, testRunId, token, options) => {
    options = options || {};
    const newOptions = {
      title: options.title || 'issue',
      description: options.description || 'test issue',
      severity: options.severity || 'major'
    };
    return testUtil.makeAuthRequest('post', `/api/projects/${projectId}/testruns/${testRunId}/issues`, token, newOptions);
  }
});
