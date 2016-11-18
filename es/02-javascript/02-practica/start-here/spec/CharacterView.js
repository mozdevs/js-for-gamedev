var samples = require('./samplelib');

xdescribe('CharactesView type', function () {
  'use strict';

  var CharactersView = require('../src/CharactersView');

  var charactersView;

  var heroTank = samples.characters.heroTank;
  var heroWizard = samples.characters.heroWizard;

  var visibleFeatures = [
    'name',
    'party',
    'initiative',
    'defense',
    'hp',
    'mp',
    'maxHp',
    'maxMp'
  ];

  beforeAll(function () {
    heroTank.party = 'teamA';
    heroWizard.party = 'teamB';
  });

  beforeEach(function () {
    charactersView = new CharactersView();
    charactersView.set({
      Tank: heroTank,
      Wizz: heroWizard
    });
  });

  it('shows only the visible features and includes id.', function () {
    var heroTankView = charactersView.get('Tank');
    var featuresCount = Object.keys(heroTankView).length ;

    expect(featuresCount).toBe(visibleFeatures.length);
    visibleFeatures.forEach(function (feature) {
      expect(heroTankView[feature]).toEqual(heroTank[feature]);
    });
  });

  it('list all characters.', function () {
    var heroTankView = charactersView.get('Tank');
    var heroWizardView = charactersView.get('Wizz');
    expect(charactersView.all())
      .toEqual({
        Tank: heroTankView,
        Wizz: heroWizardView
      });
  });

  it('list all characters by party', function () {
    var heroTankView = charactersView.get('Tank');
    var heroWizardView = charactersView.get('Wizz');
    expect(charactersView.allFrom('teamA'))
      .toEqual({
        Tank: heroTankView
      });
    expect(charactersView.allFrom('teamB'))
      .toEqual({
        Wizz: heroWizardView
      });
  });

  it('does not allow to modify character\'s features', function () {
    var heroTankView = charactersView.get('Tank');

    visibleFeatures.forEach(function (feature) {
      var expectedValue = heroTankView[feature];
      heroTankView[feature] = expectedValue + 1;
      expect(heroTankView[feature]).toEqual(expectedValue);
    });
  });

  it('does not modify the original character.', function () {
    var heroTankView = charactersView.get('Tank');

    var expectedValues = visibleFeatures.reduce(function (values, feature) {
      values[feature] = heroTank[feature];
      return values;
    }, {});

    visibleFeatures.forEach(function (feature) {
      heroTankView[feature] += 1;
      expect(heroTank[feature]).toEqual(expectedValues[feature]);
    });
  });
});
