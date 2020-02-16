var stackTrace = require('stack-trace');
var Backend = require('./backend.js');
var backend = new Backend();

class Notifier {
    constructor(config){
        this.setConstructor(config);

        this.version = require('../package.json').version
        this.notifier = {
            "name": "Tlueders",
            "url": "https://github.com/Tlueders/npm-error-notifier",
            "version": this.version
        };
    }

    /*
    * Build Constructor from user input
    * @param {object} config
    */
    setConstructor(config) {
        if(typeof config !== 'object'){
            throw 'Notifier configuration must be an Object.';
        }

        if(typeof config.api_key !== 'string' || typeof config.env !== 'string'){
            throw 'Required notifier parameters are missing or incorrect type';
        }

        this.config = config;
    }

    
    /*
    * Get method name from stack
    * @param {object} stack
    * @return {string} method_name
    */
    getMethodName(stack) {
        let method_name = "Error";

        if(stack.functionName !== null && stack.functionName !== undefined) {
            method_name = stack.functionName
        } else if(stack.methodName !== null && stack.methodName !== undefined) {
            method_name = stack.methodName;
        }

        return method_name;
    }

    /*
    * Build trace into Honeybadger specified format
    * @param {array} backtrace
    * @return {array} ret
    */
    buildTrace(backtrace) {
       let ret = [];

        if(!backtrace || !backtrace instanceof Array){
            throw 'backtrace is not an array';
        }
       
        backtrace.map(stack => {   
            let method_name = this.getMethodName(stack);
            let trace = {
                number: stack.lineNumber,
                file: stack.fileName,
                method: method_name
            };

            ret.push(trace);
        });

        return ret;
    }

    /*
    * Build notice into Honeybadger payload format
    * @param {object} err
    * @return {object} notice
    */
    buildNotice(err) {
        if(!err || typeof err !== 'object'){
            throw 'Error was not provided or is not an object.';
        }

        let backtrace = this.buildTrace(stackTrace.parse(err));

        let notice = {
            notifier: this.notifier,
            error: {
                class: err.name,
                message: err.message,
                backtrace: backtrace
            },
            server: {
                environment_name: this.config.env
            }
        }

        return notice;
    }

    /*
    * Calls backend method to send Notice
    * @param {object} err
    */
    notify(err){
        if(!err || typeof err !== 'object'){
            throw 'Error was not provided or is not an object.';
        }

        const payload = this.buildNotice(err);
        backend.sendNotice(this.config.api_key, payload);
    }
}

module.exports = Notifier;