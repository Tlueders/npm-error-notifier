var assert = require('chai').assert;
var expect = require('chai').expect;
var nock = require('nock');
var sinon = require('sinon');
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
            }, 'URL path was not provided or incorrect type.')
        });

        it('should throw error if path is incorrect type', () => {
            assert.throws(() => {
                backend.getUrl(1234);
            }, 'URL path was not provided or incorrect type.')
        });
    });

    describe('#sendNotice()', () => {
        const api_key = 'fake-key';
        const response = {id: '0bdbb3bd-290b-45b0-b0db-fd119de69bfe'};
        const payload = {
            "notifier": {
                "name": "$username's Honeybadger Notifier",
                "url": "https://github.com/$repo",
                "version": "0.0.1"
            },
            "error": {
              "class": "TypeError",
              "message": "TypeError: 'x' is not a function",
              "backtrace": [{
                 "number": "119",
                 "file": "/path/to/bar.js",
                 "method": "bar"
                }]
            },
            "server": {
              "environment_name": "production"
            }
        };

        beforeEach(() => {
            sinon.stub(console, 'log');
            
            nock('https://api.honeybadger.io', { 
                reqHeaders: {
                    'Content-type': 'application/json',
                    'x-api-key': api_key,
                    'Accept': 'application/json'
                }
            })
                .post('/v1/notices', payload)
                .reply(201, response);
        });

        afterEach(() => {
            console.log.restore();
        });

        it('should successfully send notice and console.log id', () => {
            backend.sendNotice(api_key, payload);
            expect(console.log.calledWith(`Notice successfully sent to Honeybadger! Notice ID: ${response.id}`));
        });

        it('should throw error for missing api_key', () => {
            assert.throws(() => {
                backend.sendNotice();
            }, 'Incorrect or Missing API Key');
        });

        it('should throw error for incorrect payload', () => {
            assert.throws(() => {
                backend.sendNotice(api_key, 11213);
            }, 'Payload is Incorrect or Missing');
        });
    });
});