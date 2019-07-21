var Discord = require('discord.js');
const winston = require('winston');
const warframeMarketApi = require('./warframeApi/warframeMarketAPI');

// Configure logger settings
const logConfig = {
    'transports': [
        new winston.transports.Console(),
        new winston.transports.File({filename: './auditLog/error-log.log', level: 'error'})
    ]
};

const logger = winston.createLogger(logConfig);

async function getBuyersOrdersWithItemName(urlName) {

    var data = await warframeMarketApi.getItemsWithItemNameApi(urlName);
    var buyerOrders = {
        "orders":[]
    }

    if (data != null) {
        //parse data
        try {
            var dataOrders = data.payload; 
            var datelimit = new Date();
            datelimit.setDate(datelimit.getDate() - 5);

            for (i in dataOrders.orders) {
                if (dataOrders.orders[i].order_type === "buy") {
                    let expireDay = new Date(Date.parse(dataOrders.orders[i].last_update));
                    
                    //if its 5 days prior
                    if (datelimit <= expireDay ) {
                        buyerOrders.orders.push(dataOrders.orders[i]);
                    }
           
                }
            }
           
        } catch (err) {
            logger.info(err.message);
            logger.error(new Error(err.message));
        }
    }

    return buyerOrders;
}

async function getBuyersOrdersWithItemNameStatusOnline(urlName) {

    var data = await warframeMarketApi.getItemsWithItemNameApi(urlName);
    var buyerOrders = {
        "orders": [],
        "item_name":"",
    }

    if (data != null) {
        //parse data
        var dataOrders = data.payload;
        buyerOrders.item_name = urlName;

        for (i in dataOrders.orders) {
            if (dataOrders.orders[i].order_type === "buy" && (dataOrders.orders[i].user.status === "online" || dataOrders.orders[i].user.status === "ingame")) {
                buyerOrders.orders.push(dataOrders.orders[i]);
            }
        }
    }

    if (buyerOrders.orders.length > 0) {
        return buyerOrders;
    } else {
        throw "No Buyers for " + urlName;
    }    
}

async function getSellersOrdersWithItemNameStatusOnline(urlName) {

    var data = await warframeMarketApi.getItemsWithItemNameApi(urlName);
    var sellerOrders = {
        "orders": [],
        "item_name": "",
    }

    if (data != null) {
        //parse data
        var dataOrders = data.payload;
        sellerOrders.item_name = urlName;

        for (i in dataOrders.orders) {
            if (dataOrders.orders[i].order_type === "sell" && (dataOrders.orders[i].user.status === "online" || dataOrders.orders[i].user.status === "ingame")) {
                sellerOrders.orders.push(dataOrders.orders[i]);
            }
        }

    }

    if (sellerOrders.orders.length > 0) {
        return sellerOrders;
    } else {
        throw "No Sellers for " + urlName;
    }   
}

async function getSellOrdersGivenUserName(userName) {
    var data = await warframeMarketApi.getOrdersGivenUserNameApi(userName);
    var sellOrders = {
        "sell_orders":[]
    }

    if (data != null) {
        var dataOrders = data.payload;

        var datelimit = new Date();
        datelimit.setDate(datelimit.getDate() - 5);

        for (i in dataOrders.sell_orders) {

            let expireDay = new Date(Date.parse(dataOrders.sell_orders[i].last_update));

            //if its 5 days prior
            if (datelimit <= expireDay) {
                sellOrders.sell_orders.push(dataOrders.sell_orders[i]);
            }   
        }      
    }

    if (sellOrders.sell_orders.length > 0) {
        return sellOrders;
    } else {
        throw userName + " does not have any sell orders";
    }
}

async function getBuyOrdersGivenUserName(userName) {
    var data = await warframeMarketApi.getOrdersGivenUserNameApi(userName);
    var buyOrders = {
        "buy_orders": []
    }

    if (data != null) {

        var dataOrders = data.payload;

        var datelimit = new Date();
        datelimit.setDate(datelimit.getDate() - 5);

        for (i in dataOrders.buy_orders) {

            let expireDay = new Date(Date.parse(dataOrders.buy_orders[i].last_update));

            //if its 5 days prior
            if (datelimit <= expireDay) {
                buyOrders.buy_orders.push(dataOrders.buy_orders[i]);
            }
        }
        
    }

    if (buyOrders.buy_orders.length > 0) {
        return buyOrders;
    } else {
        throw userName + " does not have any buy orders";
    }
}

async function getInGameNamesGivenUserName(userName) {
    var data = await warframeMarketApi.getUserProfileGivenUserNameApi(userName);
    var viewModelProfile = {
        "ingame_name": '',
        "reputation": '',
        "status":''
    };

    if (data != null) {
        var dataProfile = data.payload.profile;

        viewModelProfile.ingame_name = dataProfile.ingame_name;
        viewModelProfile.reputation = dataProfile.reputation;
        viewModelProfile.status = dataProfile.status;
    }

    return viewModelProfile;
}

module.exports.getBuyersOrdersWithItemName = getBuyersOrdersWithItemName;
module.exports.getBuyersOrdersWithItemNameStatusOnline = getBuyersOrdersWithItemNameStatusOnline;
module.exports.getSellersOrdersWithItemNameStatusOnline = getSellersOrdersWithItemNameStatusOnline;
module.exports.getSellOrdersGivenUserName = getSellOrdersGivenUserName;
module.exports.getBuyOrdersGivenUserName = getBuyOrdersGivenUserName;
module.exports.getInGameNamesGivenUserName = getInGameNamesGivenUserName;