var Discord = require('discord.js');
var winston = require('winston');
var auth = require('../auth.json');
var WarframeAPI = require('../services/warframeMarketService');
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

//WarframeAPI.getSellOrdersGivenUserName("Murkotam").then(items => {
//    logger.info(items);
//});
bot.on('message', (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '>') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;

            case 'ViewBuyersOnline':

                //Find items to sell
                WarframeAPI.getSellOrdersGivenUserName(args.join(' ')).then(items => {
                    if (items != null) {
                        for (i in items.sell_orders) {
                            var searchItem = Utility.itemNameFixer(items.sell_orders[i].item.zh.item_name);
                            //Find the buyers
                            WarframeAPI.getBuyersOrdersWithItemNameStatusOnline(searchItem).then(res => {
                                WarframeAPI.createEmbededMessage(res, res.item_name, message);
                            }).catch(err => {
                                logger.info(err);
                            });
                        }
                    } else {
                        //no result
                    }
                    
                }).catch(err => {
                    logger.info(err);
                });

                
                break;
            case 'vbOfflineAndOnline':
                var searchItem = Utility.itemNameFixer(args.join(' '));
                WarframeAPI.getBuyersOrdersWithItemName(searchItem).then(res => {
                    WarframeAPI.createEmbededMessage(res, searchItem, message);
                });

                break;
        }
    }
});
