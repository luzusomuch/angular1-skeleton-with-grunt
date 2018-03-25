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
  });
});
