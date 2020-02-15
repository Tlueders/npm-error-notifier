var axios = require('axios');

class Backend {
    constructor(){
        this.base_url = 'https://api.honeybadger.io';
        this.notice_path = '/v1/notices';
    }

    /*
    * Build URL based on provided path
    * @param {string} path
    * @return {string} url
    */
    getUrl(path) {
        if(!path || typeof path !== 'string') {
            throw 'URL path was not provided or incorrect type.';
        }
        const url = this.base_url + path;
        return url;
    }

    /*
    * Send Notice Payload to the Honeybadger API
    * @see https://docs.honeybadger.io/api/exceptions.html
    * @param {string} api_key
    * @param {object} payload
    */
    sendNotice(api_key, payload) {
        const path = this.getUrl(this.notice_path);

        if (!api_key || typeof api_key !== 'string') {
            throw 'Incorrect or Missing API Key';
        }

        if(!payload || typeof payload !== 'object'){
            throw 'Payload is Incorrect or Missing';
        }

        const options = {
            method: 'POST',
            headers: { 
                'Content-type': 'application/json',
                'x-api-key': api_key,
                'Accept': 'application/json'
            },
            data: payload,
            url: path,
        };

        axios(options)
            .then(res => {
                console.log(`Notice successfully sent to Honeybadger! Notice ID: ${res.data.id}`);
            }).catch(err => {
                const response_code = err.response.status;
                console.log(`Error: ${response_code}, Could not notify Honeybadger.`);
            });
    }
}

module.exports = Backend;