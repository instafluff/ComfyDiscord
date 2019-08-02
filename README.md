# ComfyDiscord
We built this Comfy Discord Bot Module live on Twitch for Coding Cafe!

**ComfyDiscord** lets you create a bot for your Discord server ***SUPER EASILY*** in just a few lines of code.

## Instafluff ##
> *Come and hang out with us at the Comfiest Corner on Twitch!*

> https://twitch.tv/instafluff

> https://twitter.com/instafluffTV

## Instructions ##

#### Node
1. Install `comfydiscord`
```
npm install comfydiscord --save
```

2. Respond to !commands in your Discord
```javascript
var ComfyDiscord = require("comfydiscord");
ComfyDiscord.onCommand = ( user, command, message, flags ) => {
  if( command == "test" ) {
    console.log( "!test was typed in chat" );
  }
}
ComfyDiscord.Init( "MyDiscordBotToken" );
```

## Flags ##

Currently, the flags possible in `onCommand()` are:

- bot

## Reading Chat Messages ##

You can read chat messages by using the `onChat()` handler

```javascript
ComfyDiscord.onChat = ( channel, user, message, flags, extra ) => {
  console.log( channel, user, message );
}
```

## Sending Chat Messages ##

Sending Chat Messages can be done through `ComfyDiscord.Say( channel, message )`.

#### Securely adding your Discord token
1. Register a Discord App, Navigate to `Bot` in the Settings Menu on the page, and Get a Discord Bot Token - [https://discordapp.com/developers/applications/](https://discordapp.com/developers/applications/)
2. Install `dotenv`
```
npm install dotenv --save
```
3. Create a file named `.env` that looks like this:
```javascript
DISCORDTOKEN=[DISCORD-BOT-TOKEN HERE] # e.g. DISCORDTOKEN=Fdkjher128764Da3B
```
4. Initialize with the Token
```javascript
var ComfyDiscord = require("comfydiscord");
ComfyDiscord.onCommand = ( user, command, message, flags ) => {
  if( command == "test" ) {
    ComfyDiscord.Say( "general", "replying to !test" );
  }
}
ComfyDiscord.Init( process.env.DISCORDTOKEN );
```

## All Supported Events ##

 - **onCommand**`( channel, user, command, message, flags, extra )`
    - Responds to "!" commands
 - **onChat**`( channel, user, message, flags, extra )`
    - Responds to user chatting

## Credits ##
Thank you too all the participants of this project!

****
