require( "dotenv" ).config();

const ComfyDiscord = require( "./index" );
ComfyDiscord.onCommand = ( channel, user, command, message, flags, extra ) => {
  console.log( command, user, message, flags );
  if( channel === "discordbotjam" ) {
    if( command === "say" ) {
      ComfyDiscord.Say( channel, "test reply" );
    }
    if( command === "photo" ) {
      ComfyDiscord.Say( channel, "photo test", {
        attachment: "https://i.pinimg.com/originals/f5/0f/2f/f50f2f07492a1436b113bcf02e497276.jpg",
        // filename: "rabbit.jpg"
      } );
    }
  }
}
ComfyDiscord.onChat = ( channel, user, message, flags, extra ) => {
  console.log( channel, user, message );
}
ComfyDiscord.Init( process.env.DISCORDTOKEN );
