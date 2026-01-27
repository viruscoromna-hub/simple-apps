const { JSDOM } = require('jsdom');

describe('frontend script', () => {
  let dom;
  let scriptModule;

  const setupDom = () => {
    dom = new JSDOM(
      '<!DOCTYPE html><body>' +
        '<article class="api-card" data-endpoint="/app1"><p class="value"></p><p class="note"></p></article>' +
        '<article class="api-card" data-endpoint="/status"><p class="value"></p><p class="note"></p></article>' +
        '</body>',
      { url: 'http://localhost' }
    );
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
  };

  const teardownDom = () => {
    if (dom) {
      dom.window.close();
    }
    delete global.window;
    delete global.document;
    delete global.navigator;
    delete globalThis.window;
    delete globalThis.document;
  };

  beforeEach(() => {
    jest.resetModules();
    setupDom();
    global.fetch = jest.fn().mockImplementation((endpoint) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            endpoint === '/status'
              ? { uptime: 123, status: 'ok', version: '1.0.0', env: 'test' }
              : { message: 'hello' }
          ),
      })
    );
    scriptModule = require('../public/scripts/app');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    delete global.fetch;
    teardownDom();
  });

  it('updates cards using fetch results', async () => {
    const card = document.querySelector('[data-endpoint="/app1"]');
    await scriptModule.updateCard(card);
    expect(card.querySelector('.value').textContent).toBe('hello');
    expect(card.dataset.state).toBe('success');
  });

  it('schedules repeated updates when kickoff runs', () => {
    jest.useFakeTimers();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const interval = scriptModule.kickoff();
    expect(interval).toBeDefined();
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 15000);
    jest.advanceTimersByTime(15000);
    expect(global.fetch).toHaveBeenCalled();
    clearInterval(interval);
    setIntervalSpy.mockRestore();
  });
});
