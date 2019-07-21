var Discord = require('discord.js');
var winston = require('winston');
var auth = require('../auth.json');
var WarframeServices = require('../services/warframeMarketService');
var WarframeMessages = require('../services/warframeRichEmbedMessages');
var Utility = require('../common/utility/utility');

// Configure logger settings
const logConfig = {
    'transports': [
        new winston.transports.Console()
    ]
};

const logger = winston.createLogger(logConfig);

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: '); 
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `>`
    if (message.content.substring(0, 1) == '>') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd.toLowerCase()) {
            // >ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;

            case 'viewbuyersonline':
                //Log who sent the request
                logger.info("ViewBuyersOnline method invoked by " + message.author.username);
                //Find items to sell
                WarframeServices.getSellOrdersGivenUserName(args.join(' ')).then(items => {

                    for (i in items.sell_orders) {
                        var searchItem = Utility.itemNameFixer(items.sell_orders[i].item.zh.item_name);
                        //Find the buyers
                        WarframeServices.getBuyersOrdersWithItemNameStatusOnline(searchItem).then(res => {
                            WarframeMessages.createSellerOrBuyerListEmbededMessage(res, res.item_name, "Buyers", message);
                        }).catch(err => {
                            logger.info(err);
                            WarframeMessages.createErrorEmbededMessage(err, message);
                        });
                    }
                }).catch(err => {
                    logger.info(err);
                    WarframeMessages.createErrorEmbededMessage(err, message);
                });

                
                break;

            case 'viewsellersonline':
                //Log who sent the request
                logger.info("ViewSellersOnline method invoked by " + message.author.username);
                //Find items to sell
                WarframeServices.getBuyOrdersGivenUserName(args.join(' ')).then(items => {

                    for (i in items.buy_orders) {
                        var searchItem = Utility.itemNameFixer(items.buy_orders[i].item.zh.item_name);
                        //Find the buyers
                        WarframeServices.getSellersOrdersWithItemNameStatusOnline(searchItem).then(res => {
                            WarframeMessages.createSellerOrBuyerListEmbededMessage(res, res.item_name, "Sellers", message);
                        }).catch(err => {
                            logger.info(err);
                            WarframeMessages.createErrorEmbededMessage(err, message);
                        });
                    }
                }).catch(err => {
                    logger.info(err);
                    WarframeMessages.createErrorEmbededMessage(err, message);
                });
                break;

            case 'help':
                //Log who sent the request
                logger.info("Help method invoked by " + message.author.username);
                WarframeMessages.createHelpEmbededMessage(message);
                break;
        }
    }
});
