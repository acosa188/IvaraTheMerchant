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

            case 'ViewBuyers':

                var searchItem = Utility.itemNameFixer(args.join(' '));
                WarframeAPI.getBuyersOrdersWithItemNameStatusOnline(searchItem).then(res => {
                    const embed = WarframeAPI.createEmbededMessage(res, searchItem);
                    message.channel.send({ embed });
                });
  
                break;
            case 'vbOfflineAndOnline':
                var searchItem = Utility.itemNameFixer(args.join(' '));
                WarframeAPI.getBuyersOrdersWithItemName(searchItem).then(res => {
                    const embed = WarframeAPI.createEmbededMessage(res, searchItem);
                    message.channel.send({ embed });
                });

                break;
        }
    }
});
