var winston = require('winston');
const axios = require('axios');
const apiUrl = "https://api.warframe.market/v1"

// Configure logger settings
const logConfig = {
    'transports': [
        new winston.transports.Console()
    ]
};

const logger = winston.createLogger(logConfig);

async function getItemsWithItemNameApi(urlName) {
    var apiCall = await axios({
        url: apiUrl + '/items/' + urlName + '/orders',
        method: 'get'
    });

    var data = apiCall.data;

    if (data != null) {
        logger.info('Getting data with ' + apiUrl + '/items/' + urlName + '/orders' + ' as the parameter');
    } else {
        throw "Either the item does not exist or no orders on this specific item."
    }

    return data;
}

async function getOrdersGivenUserNameApi(userName) {
    var apiCall = await axios({
        url: apiUrl + '/profile/' + userName + '/orders',
        method: 'get'
    });

    var data = apiCall.data;

    if (data != null) {
        logger.info('Getting data with ' + apiUrl + '/profile/' + userName + '/orders' + ' as the parameter');
    } else {
        throw "User name does not exist."
    }
    return data;
}

async function getUserProfileGivenUserNameApi(userName) {
    var apiCall = await axios({
        url: apiUrl + '/profile/' + userName,
        method: 'get'
    });

    var data = apiCall.data;

    if (data != null) {
        logger.info('Getting data with ' + apiUrl + '/profile/' + userName + ' as the parameter');
    } else {
        throw "User name does not exist."
    }
    return data;
} 
module.exports.getItemsWithItemNameApi = getItemsWithItemNameApi;
module.exports.getOrdersGivenUserNameApi = getOrdersGivenUserNameApi;
module.exports.getUserProfileGivenUserNameApi = getUserProfileGivenUserNameApi;