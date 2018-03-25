describe('Testing challenge controller', () => {
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
    token = await testUtil.registerAndLoginPartner('partner@abc.com', '123456');
  });
  it('should create a challenge', async() => {
    const challenge = await testUtil.newChallenge(newChallenge, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.video).to.deep.include(newChallenge.video);
  });
  it('should join a challenge', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallenge({
      challengeId: challenge._id
    }, token);
  });
  it('should get a challenge with submission', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallenge({
      challengeId: challenge._id,
      userIds: [...Array(200).keys()].map(i => `testid-${i}`)
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.video).to.deep.include(newChallenge.video);
    expect(challenge.submissions.length).to.equal(Constants.ITEMS_PER_PAGE);
    expect(challenge.numberOfSubmissions).to.equal(200);
  });
  it('should not join a challenge more than 1 time', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await Promise.all([
      await testUtil.joinChallenge({
        challengeId: challenge._id,
        userIds: ['id', 'id']
      }, token),
      await testUtil.joinChallenge({
        challengeId: challenge._id,
        userIds: ['id2', 'id', 'id3']
      }, token)
    ]);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    expect(challenge.submissions.length).to.equal(3);
    expect(challenge.numberOfSubmissions).to.equal(3);
  });
});
