import { DispatchFunctions } from '../../hooks';
import { dispatchChanges } from '../dispatch-changes';

describe('dispatchChanges', () => {
  let dispatch: DispatchFunctions;

  beforeEach(() => {
    dispatch = {
      all: jest.fn(),
      field: jest.fn()
    }
  });

  it('dispatches all callbacks when old value is array', () => {
    dispatchChanges([], {}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches all callbacks when new value is array', () => {
    dispatchChanges({}, [], dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches all callbacks when old value is null', () => {
    dispatchChanges(null, {}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches all when both values are different primitives', () => {
    dispatchChanges(1, 2, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches nothing when both values are the same primitive', () => {
    dispatchChanges(1, 1, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches nothing when values are the same', () => {
    dispatchChanges({a: 1}, {a: 1}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(0);
  });

  it('dispatches added field when field is added', () => {
    dispatchChanges({}, {a: 1}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledWith('a');
  });

  it('dispatches removed field when field is removed', () => {
    dispatchChanges({a: 1}, {}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledWith('a');
  });

  it('dispatches changed field when field is changed', () => {
    dispatchChanges({a: 1}, {a: 2}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(1);
    expect(dispatch.field).toHaveBeenCalledWith('a');
  });

  it('dispatches changed fields when multiple fields are changed', () => {
    dispatchChanges({a: 1, b: 1}, {a: 2, b: 2}, dispatch);

    expect(dispatch.all).toHaveBeenCalledTimes(0);
    expect(dispatch.field).toHaveBeenCalledTimes(2);
    expect(dispatch.field).toHaveBeenCalledWith('a');
    expect(dispatch.field).toHaveBeenCalledWith('b');
  });
})