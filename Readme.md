# Node.js Error Notifier
*NOTE: This is an unpublished NPM package and cannot be installed via NPM*

## To install this package and test locally:

### 1. Git clone this repo 
```
git clone https://github.com/Tlueders/npm-error-notifier.git
```

### 2. Install the package with absolute path 
```javascript
npm install '/path/to/cloned/repo'
```

### 3. Require the npm-error-notifier package and configure
```javascript
var Notifier = require('npm-error-notifier');
var notifier = new Notifier({api_key: 'honeybadger-api-key', env: 'production'});
```
---

### Example Usage
```javascript
var Notifier = require('npm-error-notifier');
var notifier = new Notifier({api: 'honeybadger-api-key', env: 'production'});

try{
    throw new Error('manually create an error');
}catch(err) {
    notifier.notify(err);
}
```

### Notes
When configuring the Notifier, these key/values are required:
```javascript
{
    api_key: 'honeybadger_api_key',
    env: 'environment_name
}
```

This package utilizes the Honeybadger.io Exceptions API. If you'd like to learn more, please visit <https://docs.honeybadger.io/api/exceptions.html>