describe('Testing authentication controller', () => {
  it('should create a user and login', async() => {
    await testUtil.registerAndLoginPartner('test@abc.com', '123456');
  });
});
