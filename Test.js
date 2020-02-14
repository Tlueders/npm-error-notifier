var Notifier = require('./lib/main.js');

var notifier = new Notifier('5c890893', 'production');

function testMethod() {
    Again
}

try {
    testMethod();
} catch(err) {
    notifier.notify(err);
}