describe('Testing challenge controller', () => {
  let token, showId;
  const newChallenge = {
    title: 'title',
    prizes: [{
      title: 'prizes 1'
    }]
  };
  before(async() => {
    token = await testUtil.registerAndLoginPartner('partner@abc.com', '123456');
    const show = await testUtil.newShow(null, token);
    showId = show._id;
    newChallenge.showId = showId;
  });
  it('should create a challenge', async() => {
    const challenge = await testUtil.newChallenge(newChallenge, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
  });
  it('should join a challenge', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallenge({
      challengeId: challenge._id,
      showId,
    }, token);
  });
  it('should get a challenge with submission', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await testUtil.joinChallenge({
      challengeId: challenge._id,
      showId,
      userIds: [...Array(200).keys()].map(i => `testid-${i}`)
    }, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/shows/${showId}/challenges/${challenge._id}`, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.submissions.length).to.equal(Constants.ITEMS_PER_PAGE);
    expect(challenge.numberOfSubmissions).to.equal(200);
  });
  it('should not join a challenge more than 1 time', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    await Promise.all([
      await testUtil.joinChallenge({
        challengeId: challenge._id,
        showId,
        userIds: ['id', 'id']
      }, token),
      await testUtil.joinChallenge({
        challengeId: challenge._id,
        showId,
        userIds: ['id2', 'id', 'id3']
      }, token)
    ]);
    challenge = await testUtil.makeAuthRequest('get', `/api/shows/${showId}/challenges/${challenge._id}`, token);
    expect(challenge.submissions.length).to.equal(3);
    expect(challenge.numberOfSubmissions).to.equal(3);
  });
  it('should create some challenge and get list', async() => {
    const newToken = await testUtil.registerAndLoginPartner('partner+list@abc.com', '123456');
    await testUtil.newChallenges(31, showId, newToken);
    let list = await testUtil.makeAuthRequest('get', `/api/shows/${showId}/challenges?page=0&limit=20`, newToken);
    expect(list.total).to.equal(31);
    expect(list.items.length).to.equal(20);
  });
});
