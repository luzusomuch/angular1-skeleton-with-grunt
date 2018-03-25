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
  it('should get a challenge', async() => {
    let challenge = await testUtil.newChallenge(newChallenge, token);
    challenge = await testUtil.makeAuthRequest('get', `/api/challenges/${challenge._id}`, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.video).to.deep.include(newChallenge.video);
  });
});
