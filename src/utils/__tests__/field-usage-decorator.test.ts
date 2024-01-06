import { fieldUsageDecorator } from '../field-usage-decorator';

describe('fieldUsageDecorator', () => {
  it('tracks usage of shallow fields', () => {
    const object = {foo: 1, bar: 2};
    const usedFieldsSet = new Set<string>();
    const decoratedObject = fieldUsageDecorator(object, usedFieldsSet);

    decoratedObject.foo;

    expect(usedFieldsSet.size).toBe(1);
    expect(usedFieldsSet.has('foo')).toBe(true);
    expect(usedFieldsSet.has('bar')).toBe(false);
  });

  it('tracks the shallow field when accessing deep fields', () => {
    const object = {foo: {deep: 1}, bar: 2};
    const usedFieldsSet = new Set<string>();
    const decoratedObject = fieldUsageDecorator(object, usedFieldsSet);

    decoratedObject.foo.deep;

    expect(usedFieldsSet.size).toBe(1);
    expect(usedFieldsSet.has('foo')).toBe(true);
    expect(usedFieldsSet.has('bar')).toBe(false);
  });

  it('tracks usage of multiple fields', () => {
    const object = {foo: 1, bar: 2};
    const usedFieldsSet = new Set<string>();
    const decoratedObject = fieldUsageDecorator(object, usedFieldsSet);

    decoratedObject.foo;
    decoratedObject.bar;

    expect(usedFieldsSet.size).toBe(2);
    expect(usedFieldsSet.has('foo')).toBe(true);
    expect(usedFieldsSet.has('bar')).toBe(true);
  });

  it('doesnt keep track of fields on previous render', () => {
    const object = {foo: 1, bar: 2};
    const usedFieldsSet = new Set<string>();
    const firstDecoratedObject = fieldUsageDecorator(object, usedFieldsSet);

    firstDecoratedObject.foo;
    firstDecoratedObject.bar;

    const secondDecoratedObject = fieldUsageDecorator(object, usedFieldsSet);

    secondDecoratedObject.foo;

    expect(usedFieldsSet.size).toBe(1);
    expect(usedFieldsSet.has('foo')).toBe(true);
    expect(usedFieldsSet.has('bar')).toBe(false);
  });
})