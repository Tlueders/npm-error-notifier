var expect = require('chai').expect;
var assert = require('chai').assert;
var Notifier = require('../lib/main.js');

describe('Notifier', () => {
    describe('#configure()', () => {
        it('provides missing config options', () => {
            assert.throws(() => {
                new Notifier();
            }, 'Notifier parameters are missing or type must be strings.')
        });

        it('provides incorrect type config options', () => {
            assert.throws(() => {
                new Notifier({api_key: 'fail'});
            }, 'Notifier parameters are missing or type must be strings.')
        });

        it('checks for valid config options', () => {
            let notifier = new Notifier('api-key', 'dev');
            assert.equal('api-key', notifier.api_key);
            assert.equal('dev', notifier.env);
        });
    });
})