# Ivara The Merchant


## About this Bot

This Bot uses the [warframe.market](https://docs.google.com/document/d/1121cjBNN4BeZdMBGil6Qbuqse-sWpEXPpitQH5fb_Fo/edit#heading=h.k6jx06yze7kn) public API to request information.
It then uses this information to select buyers or sellers based on the user profile's orders. 

## Requirements
- Complete these create a bot guide [steps](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) up until "STEP 4".
- Make sure to install [Node.js](https://nodejs.org/en/download/)
- Grab this project by cloning it or dowloading the files.
- In /IvaraTheMerchant/IvaraJScripts, create two files named auth.json and package.json.
- In auth.json, add this JSON line 
```
{
  "token": "Secret Key"
}
```
- In package.json, add these JSON line
```
{
  "name": "Ivara-the-merchant",
  "version": "1.0.0",
  "description": "",
  "main": "bot.js",
  "author": "JuneBug",
  "dependencies": {
    "axios": "^0.19.0",
    "discord.js": "^11.4.2",
    "sqlite3": "^4.0.6",
    "winston": "^3.2.1",
    "xmlhttprequest": "^1.8.0"
  }
}
```

- After all that, go to the command line and to this folder location IvaraTheMerchant/Ivara.JScripts/scripts/
- Then run this command, node bot.js
- Then it should be all ready to go.

## Setting up this bot

