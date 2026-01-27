const app = require('../app');
const serverModule = require('../server');

describe('server entry point', () => {
  it('exports a start function that listens on the configured port', () => {
    const listenSpy = jest.spyOn(app, 'listen').mockImplementation((_, callback) => {
      if (typeof callback === 'function') {
        callback();
      }
      return {
        on: jest.fn(),
        close: jest.fn(),
      };
    });

    const server = serverModule.start();
    expect(listenSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));

    if (server && typeof server.close === 'function') {
      server.close();
    }

    listenSpy.mockRestore();
  });

  it('returns the configured port when getPort is called', () => {
    const originalPort = process.env.APP_PORT;
    process.env.APP_PORT = '4000';
    expect(serverModule.getPort()).toBe(4000);
    process.env.APP_PORT = originalPort;
  });
});
