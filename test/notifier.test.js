var expect = require('chai').expect;
var assert = require('chai').assert;

var Notifier = require('../lib/main.js.js');

describe('Notifier Placeholder Test', () => {
    it('Should return Api Key', () => {
        const notifier = new Notifier('1234');
        const apiKey = notifier.getApiKey();
        expect(apiKey).to.equals('1234');
    })
});