import { createSubscribeContext } from '../subscribe-context';

describe('createSubscribeContext', () => {
  it('returns a different context on every call', () => {
    const firstContext = createSubscribeContext();
    const secondContext = createSubscribeContext();

    expect(firstContext === secondContext).toBe(false);
  });
})