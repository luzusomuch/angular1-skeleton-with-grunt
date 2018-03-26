describe('Testing show controller', () => {
  let token;
  const newShow = {
    title: 'title',
    video: {
      originalUrl: 'url 1',
      thumbnails: ['thumb 1', 'thumb 2']
    }
  };
  before(async() => {
    token = await testUtil.registerAndLoginPartner('partner+show@abc.com', '123456');
  });
  it('should create a show', async() => {
    const show = await testUtil.newShow(newShow, token);
    expect(show.title).to.be.equal(newShow.title);
    expect(show.video).to.deep.include(newShow.video);
  });
});
