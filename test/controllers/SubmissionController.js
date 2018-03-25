describe('Testing submission controller', () => {
  let token;
  const newChallenge = {
    title: 'title',
    prizes: [{
      title: 'prizes 1'
    }],
    video: {
      originalUrl: 'url 1',
      thumbnails: ['thumb 1', 'thumb 2']
    }
  };
  before(async() => {
    token = await testUtil.registerAndLoginPartner('partner1@abc.com', '123456');
  });
  it('should get a submission', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallengeWithVideo({
      challengeId: challenge._id,
      userIds: [...Array(53).keys()].map(i => `testid-${i}`)
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    const submission = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}/submissions/${challenge.submissions[0]._id}`, token);
    expect(submission.challenge).to.equal(challenge._id);
    expect(submission.user.id).to.equal('testid-0');
  });
  it('should like a submission', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallengeWithVideo({
      challengeId: challenge._id,
      userIds: [...Array(200).keys()].map(i => `testid-${i}`)
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    await testUtil.likeSubmission({
      challengeId: challenge._id,
      submissionId: challenge.submissions[0]._id,
      userIds: [...Array(200).keys()].map(i => `testid-${i}`)
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.video).to.deep.include(newChallenge.video);
    expect(challenge.submissions.length).to.equal(Constants.ITEMS_PER_PAGE);
    expect(challenge.submissions[0].video.likes.length).to.equal(Constants.ITEMS_PER_PAGE);
    expect(challenge.submissions[0].video.numberOfLikes).to.equal(200);
  });
  it('should not like a submission more than 1 time', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallengeWithVideo({
      challengeId: challenge._id,
      userIds: ['joinid']
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    await Promise.all([
      testUtil.likeSubmission({
        challengeId: challenge._id,
        submissionId: challenge.submissions[0]._id,
        userId: ['id', 'id']
      }, token),
      testUtil.likeSubmission({
        challengeId: challenge._id,
        submissionId: challenge.submissions[0]._id,
        userId: ['id2', 'id']
      }, token),
    ]);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    expect(challenge.submissions[0].video.likes.length).to.equal(2);
    expect(challenge.submissions[0].video.numberOfLikes).to.equal(2);
  });
  it('should get list of submissions', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallengeWithVideo({
      challengeId: challenge._id,
      userIds: [...Array(58).keys()].map(i => `testid-${i}`)
    }, token);
    let list = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}/submissions?page=0&limit=20`, token);
    expect(list.total).to.equal(58);
    expect(list.items.length).to.equal(20);
    list = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}/submissions?page=1&limit=50`, token);
    expect(list.total).to.equal(58);
    expect(list.items.length).to.equal(8);
  });
});
