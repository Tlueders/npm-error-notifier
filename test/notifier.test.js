var expect = require('chai').expect;
var assert = require('chai').assert;
var Notifier = require('../lib/main.js');

describe('Notifier', () => {
    describe('#configure()', () => {
        it('provides missing config options', () => {
            assert.throws(() => {
                new Notifier({api_key: '1234312'});
            }, 'Required notifier parameters are missing or incorrect type')
        });

        it('provides incorrect type config options', () => {
            assert.throws(() => {
                new Notifier('12314');
            }, 'Notifier configuration must be an Object.')
        });

        it('checks for valid config options', () => {
            let notifier = new Notifier({api_key: '1234312', env: 'production'});
            assert.equal('1234312', notifier.config.api_key);
            assert.equal('production', notifier.config.env);
        });
    });
})