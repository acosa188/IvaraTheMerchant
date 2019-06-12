var Discord = require('discord.js');
const winston = require('winston');
const warframeMarketApi = require('./warframeApi/warframeMarketAPI');

// Configure logger settings
const logConfig = {
    'transports': [
        new winston.transports.Console()
    ]
};

const logger = winston.createLogger(logConfig);

function createEmbededMessage(data, itemName) {
    const embed = new Discord.RichEmbed()
        .setTitle("Buyers for the item `" + itemName + "`")
        .setAuthor("Ivara The Merchant", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2aacee09-3501-40fa-a8e2-7071eae8dde9/da20f5n-8763018d-282c-46b0-8ffe-3e87138c3630.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJhYWNlZTA5LTM1MDEtNDBmYS1hOGUyLTcwNzFlYWU4ZGRlOVwvZGEyMGY1bi04NzYzMDE4ZC0yODJjLTQ2YjAtOGZmZS0zZTg3MTM4YzM2MzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.x1VHjxDVlKDoxn5MjQ33N9eG26ZE17R3M2wJw16Cjuw")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("These are a list of potential buyers.")
        .setFooter(data.orders.length.toString() + " potential buyers.", "https://i.imgur.com/Jkq5UIF.png")
        .setThumbnail("http://i.imgur.com/lh5YKoc.png")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()

    for (i in data.orders) {
        if (i < 24) {
            embed.addField(data.orders[i].user.ingame_name, "Quantity needed: " + data.orders[i].quantity + "\n" +
                "For the price of: " + data.orders[i].platinum + " platinum \n" +
                "User Status: " + data.orders[i].user.status + "\n" +
                "Last Updated: " + data.orders[i].last_update);
        }
        else {
            embed.addField("...", "More Buyers");
            break;
        }
    }
    return embed;
}

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
        }
    }

    return buyerOrders;
}

async function getBuyersOrdersWithItemNameStatusOnline(urlName) {

    var data = await warframeMarketApi.getItemsWithItemNameApi(urlName);
    var buyerOrders = {
        "orders": []
    }

    if (data != null) {
        //parse data
        try {
            var dataOrders = data.payload;

            for (i in dataOrders.orders) {
                if (dataOrders.orders[i].order_type === "buy" && (dataOrders.orders[i].user.status === "online" || dataOrders.orders[i].user.status === "ingame")) {
                    buyerOrders.orders.push(dataOrders.orders[i]);
                }
            }

        } catch (err) {
            logger.info(err.message);
        }
    }

    return buyerOrders;
}

module.exports.getBuyersOrdersWithItemName = getBuyersOrdersWithItemName;
module.exports.getBuyersOrdersWithItemNameStatusOnline = getBuyersOrdersWithItemNameStatusOnline;
module.exports.createEmbededMessage = createEmbededMessage;