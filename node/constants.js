var config = require('config');

module.exports = Object.freeze({
    APP_SECRET: config.get('appSecret'),
    VALIDATION_TOKEN: config.get('validationToken'),
    PAGE_ACCESS_TOKEN: config.get('pageAccessToken'),
    SERVER_URL: config.get('serverURL')
});