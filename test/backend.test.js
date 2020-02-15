var assert = require('chai').assert;
var Backend = require('../lib/backend.js');
var backend = new Backend();

describe('Backend', () => {
    describe('#getUrl()', () => {
        it('should return url string', () => {
            const url = backend.getUrl('/v1/notices');
            assert.equal(url, 'https://api.honeybadger.io/v1/notices');
        });

        it('should throw error if no path provided', () => {
            assert.throws(() => {
                backend.getUrl();
            }, 'No URL path was provided.')
        });
    });
})