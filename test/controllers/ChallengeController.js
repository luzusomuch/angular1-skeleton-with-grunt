describe('Testing challenge controller', () => {
  let token;
  const newChallenge = {
    title: 'title',
    prizes: [{
      title: 'prizes 1'
    }],
    videos: [{
      url: 'url 1',
      thumbnail: 'thumb 1'
    }]
  };
  before(async() => {
    token = await testUtil.registerAndLoginPartner('partner@abc.com', '123456');
  });
  it('should create a challenge', async() => {
    const challenge = await testUtil.newChallenge(newChallenge, token);
    expect(challenge.title).to.be.equal(newChallenge.title);
    expect(challenge.prizes[0]).to.deep.include(newChallenge.prizes[0]);
    expect(challenge.videos[0]).to.deep.include(newChallenge.videos[0]);
  });
});
