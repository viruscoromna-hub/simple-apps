describe('start entry point', () => {
  it('delegates to server.start when required', () => {
    jest.resetModules();
    const startMock = jest.fn();

    jest.isolateModules(() => {
      jest.doMock('../server', () => ({ start: startMock }));
      require('../start');
    });

    expect(startMock).toHaveBeenCalled();
  });
});
