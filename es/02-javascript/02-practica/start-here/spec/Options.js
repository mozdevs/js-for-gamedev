describe('Options type', function () {
  'use strict';

  var Options = require('../src/Options');

  var options;

  var dataFor = {
    itemA: {},
    itemB: {},
    itemC: {}
  };

  var items = {
    itemA: dataFor.itemA,
    itemB: dataFor.itemB,
    itemC: dataFor.itemC
  };

  beforeEach(function () {
    options = new Options(items);
  });

  it('allows the empty menu.', function () {
    options = new Options();
    expect(options.list()).toEqual([]);
  });

  it('list all the options.', function () {
    expect(options.list())
      .toEqual(jasmine.arrayContaining(Object.keys(items)));
  });

  it('recovers data associated to the menu item.', function () {
    expect(options.get('itemA')).toBe(dataFor['itemA']);
  });

  xit('emits an event when selecting an entry.', function (done) {
    var entryId = 'itemA';
    options.on('chose', function (id, data) {
      expect(id).toBe(entryId);
      expect(data).toBe(dataFor[entryId]);
      done();
    });
    options.select(entryId);
  });

  xit('emits an error event when the entry does not exist.', function (done) {
    var entryId = 'xxxx';
    options.on('choseError', function (reason, id) {
      expect(reason).toBe('option-does-not-exist');
      expect(id).toBe(entryId);
      done();
    });
    options.select(entryId);
  });
});
