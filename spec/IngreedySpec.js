'use strict';

var ingreedyMatchers = {
  toBeParsedAs: function(util, customEqualityTesters) {
    return {
      compare: function(inputString, expected) {
        var parserResult;
        var specResult = {};

        try {
          parserResult = Ingreedy.parse(inputString);
        } catch(err) {
          specResult.pass = false;
        }

        if(specResult.pass !== false) {
          specResult.pass = util.equals(parserResult, expected);
        }

        if(specResult.pass) {
          specResult.message = 'Ingreedy successfully parsed "' + inputString + '"';
        } else {
          specResult.message = 'Ingreedy parsed \n' + JSON.stringify(parserResult) + '\ninstead of \n' + JSON.stringify(expected);
        }

        return specResult;
      }
    }
  }
};

describe("Ingreedy", function() {
  var parser = Ingreedy;

  beforeEach(function() {
    jasmine.addMatchers(ingreedyMatchers);
  });

  describe('simple ingredient additions', function() {
    it('parses the correct values', function() {
      expect('1 lb potatoes').toBeParsedAs({
        amount: '1',
        unit: 'lb',
        ingredient: 'potatoes'
      });
    });
  });

  describe('ingredient additions with a container', function() {
    it('parses the correct values', function() {
      expect('2 28 oz can tomatoes').toBeParsedAs({
        amount: '2',
        ingredient: 'can tomatoes',
        container: {
          amount: '28',
          unit: 'oz'
        }
      });
    });
  });

  describe('comments', () => {
    it('treats text in parentheses as comments', () => {
      expect('2 peppers (red or green)').toBeParsedAs({
        amount: '2',
        ingredient: 'peppers',
        comment: 'red or green'
      })
    })
    
    it('treats text after comma as comments', () => {
      expect('34 tomatoes, sliced').toBeParsedAs({
        amount: '34',
        ingredient: 'tomatoes',
        comment: 'sliced'
      })
    })
  })
});
