'use strict';

var mockery = require('mockery');

xdescribe('OptionsStack type', function () {
  var OptionsStack;
  var optionsStack;

  var MockOptions = jasmine.createSpy('MockOptions');
  MockOptions.prototype.select = function() {};
  MockOptions.prototype.list = function() {};
  MockOptions.prototype.get = function() {};

  beforeAll(function () {
    mockery.registerMock('./Options', MockOptions);
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    OptionsStack = require('../src/OptionsStack');
  });

  afterAll(function () {
    mockery.disable();
    mockery.deregisterMock('./Options');
  });

  beforeEach(function () {
    spyOn(MockOptions.prototype, 'select');
    spyOn(MockOptions.prototype, 'list');
    spyOn(MockOptions.prototype, 'get');
    optionsStack = new OptionsStack();
  });

  it('adds an options group by assigning a group to current.', function () {
    var group = new MockOptions();
    optionsStack.current = group;
    expect(optionsStack.current).toBe(group);
  });

  it('adds an options group by assigning a object to current.', function () {
    var group = { a: 1, b: 2};
    optionsStack.current = group;
    expect(MockOptions).toHaveBeenCalledWith(group);
    expect(optionsStack.current).toEqual(jasmine.any(MockOptions));
  });

  it('returns to the previous options group when calling cancel().',
  function () {
    var group = new MockOptions();
    var group2 = new MockOptions();
    optionsStack.current = group;
    optionsStack.current = group2;
    expect(optionsStack.current).toBe(group2);
    optionsStack.cancel();
    expect(optionsStack.current).toBe(group);
  });

  it('proxies get() to the latest options group.', function () {
    var group = new MockOptions();
    optionsStack.current = group;
    optionsStack.get();
    expect(MockOptions.prototype.get).toHaveBeenCalled();
  });

  xit('proxies select() to the latest options group.', function () {
    var group = new MockOptions();
    optionsStack.current = group;
    optionsStack.select('x');
    expect(MockOptions.prototype.select).toHaveBeenCalledWith('x');
  });

  xit('proxies list() to the latest options group.', function () {
    var group = new MockOptions();
    optionsStack.current = group;
    optionsStack.list();
    expect(MockOptions.prototype.list).toHaveBeenCalled();
  });
});
