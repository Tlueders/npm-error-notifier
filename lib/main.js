var stackTrace = require('stack-trace');
var Backend = require('./backend.js');
var backend = new Backend();

class Notifier {
    constructor(config){
        this.setConstructor(config);

        this.version = require('../package.json').version
        this.notifier = {
            "name": "Tlueders Honeybadger Notifier",
            "url": "https://github.com/$repo",
            "version": this.version
        };
    }

    /*
    * Build Constructor from user input
    * @param {object} config
    */
    setConstructor(config) {
        if(typeof config !== 'object'){
            throw 'Notifier configuration must be an Object.'
        }

        if(typeof config.api_key !== 'string' || typeof config.env !== 'string'){
            throw 'Required notifier parameters are missing or incorrect type';
        }

        for (let opt in config) {
            this[opt] = config[opt];
        }
    }

    /*
    * Build trace into Honeybadger specified format
    * @param {object} backtrace
    * @return {array} ret
    */
    buildTrace(backtrace) {
        let ret = [];
        
        backtrace.map(stack => {   
            let methodName = stack.methodName;

            if(methodName === null) {
                methodName = stack.functionName
            }
            
            let trace = {
                number: stack.lineNumber,
                file: stack.fileName,
                method: methodName
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
        let backtrace = this.buildTrace(stackTrace.parse(err));

        let notice = {
            notifier: this.notifier,
            error: {
                class: err.name,
                message: err.message,
                backtrace: backtrace
            },
            server: {
                environment_name: this.env
            }
        }

        return notice;
    }

    /*
    * Calls backend method to send Notice
    * @param {object} err
    */
    notify(err){
        const payload = this.buildNotice(err);
        backend.sendNotice(this.api_key, payload);
    }
}

module.exports = Notifier;