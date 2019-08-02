const Discord = require('discord.js');
var client = null;

var comfyDiscord = {
  isDebug: false,
  onCommand: function( channel, user, command, message, flags, extra ) {
    if( comfyDiscord.isDebug ) {
      console.log( "onCommand default handler" );
    }
  },
  onChat: function( channel, user, message, flags, extra ) {
    if( comfyDiscord.isDebug ) {
      console.log( "onChat default handler" );
    }
  },
  Say: function( channel, message ) {
    if( client ) {
      const discordChannel = client.channels.find(ch => ch.name === channel );
      // console.log( discordChannel );
      // Do nothing if the channel wasn't found on this server
      if( !discordChannel ) return;
      discordChannel.send( message )
      .catch( function( error ) { console.log( "Error:", error ); } );
      return true;
    }
    return false;
  },
  GetClient: function() {
    return client;
  },
  Init: function( token, isDebug ) {
    comfyDiscord.isDebug = isDebug;

    client = new Discord.Client();
    client.on( 'message', function( data ) {
      try {
        // console.log( data );
        let channel = data.channel.name;
        let channelId = data.channel.id;
        let isBot = data.author.bot;
        let user = data.author.username;
        let userNum = data.author.discriminator;
        let nickname = data.member.nickname;
        let name = nickname || ( user + "#" + userNum );
        var message = data.content;
        var messageId = data.id;
        var flags = {
          bot: isBot
        };
        var extra = {
          id: messageId,
          channelId: channelId,
          channel: channel,
          username: user,
          userNumber: userNum,
          nickname: nickname,
          displayName: name
        };
        if( !isBot && message[ 0 ] === "!" ) {
          // Message is a command
          var parts = message.split( / (.*)/ );
          var command = parts[ 0 ].slice( 1 ).toLowerCase();
          var msg = parts[ 1 ] || "";
          comfyDiscord.onCommand( channel, user, command, msg, flags, extra );
        }
        else {
          comfyDiscord.onChat( channel, user, message, flags, extra );
        }
      }
      catch( error ) {
        console.log( "Error:", error );
      }
    });
    client.on( 'ready', function() {
      console.log( `Logged in as ${client.user.tag}!` );
    });
    client.on( "error", console.error );
    client.on( 'reconnect', function() {
      console.log( 'Reconnecting' );
    });
    client.login( token )
    .catch( function( error ) { console.log( "Error:", error ); } );
  }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = comfyDiscord;
}
