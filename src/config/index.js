let config_DEFAULT = require('./default');
let config_PRODUCTION = require('./default');
let config_DEV = require('./default');

function getConfig() {
    if (process.env.NODE_ENV === 'dev') {
        return config_DEV;
    } else if (process.env.NODE_ENV === 'production') {
        return config_PRODUCTION;
    } else {
        return config_DEFAULT;
    }
}

module.exports = getConfig();