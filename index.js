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
  Say: function( channel, message, opts ) {
    if( client ) {
      const discordChannel = client.channels.find(ch => ch.name === channel );
      // console.log( discordChannel );
      // Do nothing if the channel wasn't found on this server
      if( !discordChannel ) return;
      if( opts && opts.attachment ) {
        var filename = opts.filename || opts.attachment.substring(opts.attachment.lastIndexOf('/')+1);
        const attachment = new Discord.Attachment( opts.attachment, filename );
        discordChannel.send( message, attachment )
        .catch( function( error ) { console.log( "Error:", error ); } );
      }
      else {
        discordChannel.send( message )
        .catch( function( error ) { console.log( "Error:", error ); } );
      }
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
        let channel = data.channel;
        let channelName = data.channel.name;
        let channelId = data.channel.id;
        let isBot = data.author.bot;
        let userId = data.author.id;
        let user = data.author.username;
        let userNum = data.author.discriminator;
        let nickname = data.member.nickname;
        let name = nickname || ( user + "#" + userNum );
        var message = data.content;
        var messageId = data.id;
        var cleanContent = data.cleanContent;
        var flags = {
          bot: isBot
        };
        var extra = {
          id: messageId,
          channelId: channelId,
          channel: channel,
          userId: userId,
          username: user,
          userNumber: userNum,
          nickname: nickname,
          displayName: name,
          cleanContent: cleanContent
        };
        if( !isBot && message[ 0 ] === "!" ) {
          // Message is a command
          var parts = message.split( / (.*)/ );
          var command = parts[ 0 ].slice( 1 ).toLowerCase();
          var msg = parts[ 1 ] || "";
          comfyDiscord.onCommand( channelName, user, command, msg, flags, extra );
        }
        else if ( userId != client.user.id ) {
          comfyDiscord.onChat( channelName, user, message, flags, extra );
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
