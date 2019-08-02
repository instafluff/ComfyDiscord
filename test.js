require('dotenv').config();

var ComfyDiscord = require("./app");
ComfyDiscord.onCommand = ( channel, user, command, message, flags, extra ) => {
  console.log( command, user, message, flags );
  if( channel === "discordbotjam" ) {
    if( command == "say" ) {
      ComfyDiscord.Say( channel, "test reply" );
    }
  }
}
ComfyDiscord.onChat = ( channel, user, message, flags, extra ) => {
  console.log( channel, user, message );
}
ComfyDiscord.Init( process.env.DISCORDTOKEN );
