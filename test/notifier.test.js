var assert = require('chai').assert;
var Notifier = require('../lib/main.js');

describe('Notifier', () => {
    describe('#setConstructor()', () => {
        it('should throw error for provided missing config options', () => {
            assert.throws(() => {
                new Notifier({api_key: '1234312'});
            }, 'Required notifier parameters are missing or incorrect type')
        });

        it('should throw error for provided incorrect type config options', () => {
            assert.throws(() => {
                new Notifier('12314');
            }, 'Notifier configuration must be an Object.')
        });

        it('should check for valid & required config options', () => {
            let notifier = new Notifier({api_key: '1234312', env: 'production'});
            assert.equal('1234312', notifier.config.api_key);
            assert.equal('production', notifier.config.env);
        });
    });

    describe('#notify()', () => {
        it('should provide error for missing api_key', () => {
            assert.throws(() => {
                let notifier = new Notifier({api_key: '', env: 'production'});
                notifier.notify(new Error('test error'));
            }, 'Incorrect or Missing API Key');
        });

        it('should throw an error if err is not an object', () => {
            assert.throws(() => {
                let notifier = new Notifier({api_key: '', env: 'production'});
                notifier.notify(12134);
            }, 'Error was not provided or is not an object.');
        });
    })

    describe('#buildNotice()', () => {
        it('should return a notice formatted for Honeybadger API', () => {
            let notifier = new Notifier({api_key: 'fake', env: 'production'});
            let notice = notifier.buildNotice(new Error('test error'));
            assert.isObject(notice);
            assert.property(notice, 'notifier');
            assert.property(notice, 'error');
            assert.property(notice, 'server');
        });

        it('should throw error if no error is provided', () => {
            assert.throws(() => {
                let notifier = new Notifier({api_key: 'api-key', env: 'production'});
                notifier.buildNotice();
            }, 'Error was not provided or is not an object.');
        });

        it('should throw error if not an object', () => {
            assert.throws(() => {
                let notifier = new Notifier({api_key: 'api-key', env: 'production'});
                notifier.buildNotice(123);
            }, 'Error was not provided or is not an object.');
        })
    });

    describe('#buildTrace()', () => {
        it('should return empty array if no stack is provided', () => {
            let notifier = new Notifier({api_key: 'fake', env: 'production'});
            let stack = [];
            const new_stack = notifier.buildTrace(stack);
            assert.isArray(new_stack);
            assert.lengthOf(new_stack, 0);
        });
        
        it('should return a formatted stack trace for Honeybadger API', () => {
            let notifier = new Notifier({api_key: 'fake', env: 'production'});
            let stack = [{ 
                fileName: 'Test.js',
                lineNumber: 1,
                functionName: null,
                typeName: 'Object',
                methodName: 'test',
                columnNumber: 5,
                native: false 
            }];
            const new_stack = notifier.buildTrace(stack);
            assert.isArray(new_stack);
            assert.equal(new_stack[0].number, stack[0].lineNumber);
            assert.equal(new_stack[0].file, stack[0].fileName);
            assert.equal(new_stack[0].method, stack[0].methodName);
        });
    });

    describe('#getMethodName()', () => {
        it('should return a valid method name', () => {
            let notifier = new Notifier({api_key: 'fake', env: 'production'});
            let stack = { 
                functionName: null,
                methodName: 'test'
            };
            const method_name = notifier.getMethodName(stack);
            assert.isString(method_name);
            assert.equal(method_name, stack.methodName);
        });

        it('should return the default method name: "Error" if both values null', () => {
            let notifier = new Notifier({api_key: 'fake', env: 'production'});
            let stack = { 
                functionName: null,
                methodName: null
            };
            const method_name = notifier.getMethodName(stack);
            assert.isString(method_name);
            assert.equal(method_name, 'Error');
        });
    });
});