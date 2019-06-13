var Discord = require('discord.js');
const winston = require('winston');

function createSellerOrBuyerListEmbededMessage(data, itemName, type, message) {
    const embed = new Discord.RichEmbed()
        .setTitle(type + " for the item `" + itemName + "`")
        .setAuthor("Ivara The Merchant", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2aacee09-3501-40fa-a8e2-7071eae8dde9/da20f5n-8763018d-282c-46b0-8ffe-3e87138c3630.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJhYWNlZTA5LTM1MDEtNDBmYS1hOGUyLTcwNzFlYWU4ZGRlOVwvZGEyMGY1bi04NzYzMDE4ZC0yODJjLTQ2YjAtOGZmZS0zZTg3MTM4YzM2MzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.x1VHjxDVlKDoxn5MjQ33N9eG26ZE17R3M2wJw16Cjuw")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("These are a list of potential " + type + ".")
        .setFooter(data.orders.length.toString() + " potential " + type + ".", "https://i.imgur.com/Jkq5UIF.png")
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
                "/w " + data.orders[i].user.ingame_name + " Hi! I want to " + (type.toLowerCase() === "buyers" ? "sell" : "buy") + ": " + itemName.replace("_", " ") + " for " + data.orders[i].platinum + " platinum. \n" +
                "Last Updated: " + data.orders[i].last_update);
        }
        else {
            embed.addField("...", "More Buyers");
            break;
        }
    }

    message.channel.send({ embed });
}

function createErrorEmbededMessage(errorMessage, message) {
    const embed = new Discord.RichEmbed()
        .setTitle("ERROR")
        .setAuthor("Ivara The Merchant", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2aacee09-3501-40fa-a8e2-7071eae8dde9/da20f5n-8763018d-282c-46b0-8ffe-3e87138c3630.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJhYWNlZTA5LTM1MDEtNDBmYS1hOGUyLTcwNzFlYWU4ZGRlOVwvZGEyMGY1bi04NzYzMDE4ZC0yODJjLTQ2YjAtOGZmZS0zZTg3MTM4YzM2MzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.x1VHjxDVlKDoxn5MjQ33N9eG26ZE17R3M2wJw16Cjuw")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0xE51240)
        .setDescription(errorMessage)
        .setFooter("Errors are found", "https://i.imgur.com/Jkq5UIF.png")
        .setThumbnail("https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()

    message.channel.send({ embed });
}

function createHelpEmbededMessage(message) {
    const embed = new Discord.RichEmbed()
        .setTitle("List of Commands:")
        .setAuthor("Ivara The Merchant", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2aacee09-3501-40fa-a8e2-7071eae8dde9/da20f5n-8763018d-282c-46b0-8ffe-3e87138c3630.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJhYWNlZTA5LTM1MDEtNDBmYS1hOGUyLTcwNzFlYWU4ZGRlOVwvZGEyMGY1bi04NzYzMDE4ZC0yODJjLTQ2YjAtOGZmZS0zZTg3MTM4YzM2MzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.x1VHjxDVlKDoxn5MjQ33N9eG26ZE17R3M2wJw16Cjuw")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x283EBF)
        //.setDescription()
        .setFooter("Errors are found", "https://i.imgur.com/Jkq5UIF.png")
        .setThumbnail("https://www.norbord.co.uk/media/1548/question-mark-faqs-icon.png?anchor=center&mode=crop&width=800&height=800&rnd=131744848580000000")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()
        .addField(">ViewBuyersOnline <UserName>", " Uses user's list of items sell orders at warframe.market and find potential buyers that are online or in game.")
        .addField(">ViewSellersOnline <UserName>"," Uses user's list of items buy orders at warframe.market and find potential buyers that are online or in game.")


    message.channel.send({ embed });
}

module.exports.createSellerOrBuyerListEmbededMessage = createSellerOrBuyerListEmbededMessage;
module.exports.createErrorEmbededMessage = createErrorEmbededMessage;
module.exports.createHelpEmbededMessage = createHelpEmbededMessage;