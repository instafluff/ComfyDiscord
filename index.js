const Discord = require( "discord.js" );
/** @type {import("discord.js").Client)} */
let client = null;

/**
 * @typedef MessageFlags Basic flags about the user.
 * @prop {boolean} bot If the user is a bot account.
 */

/**
 * @typedef MessageExtras Extra details from the message.
 * @prop {string} id The message ID.
 * @prop {string} channelId The channel ID.
 * @prop {import("discord.js").TextChannel | import("discord.js").DMChannel | import("discord.js").GroupDMChannel} channel Channel.
 * @prop {string} userId Message author's ID.
 * @prop {string} username Message author's username.
 * @prop {string} userNumber Message author's username discriminator.
 * @prop {string} nickname Message author's nickname within the guild.
 * @prop {string} displayName Nickname or username with discriminator.
 * @prop {string} cleanContent The message contents with all mentions replaced
 * by the equivalent text.
 */

/**
 * @typedef SayOptions Extra options for the message.
 * @prop {string} [attachment] Location of the attachment file.
 * @prop {string} [filename] Name to display for the file, can be assumed from
 * `attachment`.
 */

const comfyDiscord = {
  /** @type {boolean} If debug mode is enabled. */
  isDebug: false,
  /**
   * Received a message starting with an exclamation mark.
   * @param {string} channel Name of the Discord channel.
   * @param {string} user Name of the message author.
   * @param {string} command Name of the command used. The "!" is removed and
   * is lower case.
   * @param {string} message The message without the command.
   * @param {MessageFlags} flags Basic flags about the user.
   * @param {MessageExtras} extra Extra details from the message.
   */
  onCommand: function( channel, user, command, message, flags, extra ) {
    if( comfyDiscord.isDebug ) {
      console.log( "onCommand default handler" );
    }
  },
  /**
   * Received a regular chat message.
   * @param {string} channel Name of the Discord channel.
   * @param {string} user Name of the message author.
   * @param {string} message The message.
   * @param {MessageFlags} flags Basic flags about the user.
   * @param {MessageExtras} extra Extra details from the message.
   */
  onChat: function( channel, user, message, flags, extra ) {
    if( comfyDiscord.isDebug ) {
      console.log( "onChat default handler" );
    }
  },
  /**
   * Send a message to a channel.
   * @param {string} channel Name of the channel to send the message to.
   * @param {string} message Message content to send to the channel.
   * @param {SayOptions} [opts] Extra options for the message.
   * @returns {boolean} If the message was minimally able to be sent.
   * @todo Return Promise with the resulting Discord Message message.
   */
  Say: function( channel, message, opts ) {
    if( !client ) {
      return false;
    }
    const discordChannel = client.channels.find( ch => ch.name === channel );
    // console.log( discordChannel );
    // Do nothing if the channel wasn't found on this server
    if( !discordChannel ) {
      return false;
    }
    /** @type {Promise<import("discord.js").Message | import("discord.js").Message[]} */
    let prom;
    if( opts && opts.attachment ) {
      const { attachment } = opts;
      const filename = opts.filename || attachment.substring( attachment.lastIndexOf( "/" ) + 1 );
      const attachment = new Discord.Attachment( attachment, filename );
      prom = discordChannel.send( message, attachment );
    }
    else {
      prom = discordChannel.send( message );
    }
    prom.catch( ( error ) => console.log( "Error:", error ) );
    return true;
  },
  /**
   * Get the Discord.js Client instance.
   * @returns {import("discord.js").Client}
   */
  GetClient: function() {
    return client;
  },
  /**
   * Initialize the Discord bot.
   * @param {string} token OAuth token for the bot.
   * @param {boolean} [isDebug] Change the debug property.
   */
  Init: function( token, isDebug ) {
    if( isDebug !== undefined ) {
      comfyDiscord.isDebug = isDebug;
    }

    client = new Discord.Client();
    client.on( "message", ( data ) => {
      try {
        // console.log( data );
        const { channel, author, member, id, content: message, cleanContent } = data;
        const { name: channelName, id: channelId } = channel;
        const { id: userId, username, discriminator: userNumber, bot } = author;
        const { nickname } = member;
        const flags = { bot };
        const displayName = nickname || `${ username }#${ userNumber }`;
        const extra = { id, channelId, channel, userId, username, userNumber, nickname, displayName, cleanContent };
        if( !bot && message[ 0 ] === "!" ) {
          // Message is a command
          const parts = message.split( / (.*)/ );
          const command = parts[ 0 ].slice( 1 ).toLowerCase();
          const msg = parts[ 1 ] || "";
          comfyDiscord.onCommand( channelName, username, command, msg, flags, extra );
        }
        else if ( userId != client.user.id ) {
          comfyDiscord.onChat( channelName, username, message, flags, extra );
        }
      }
      catch( error ) {
        console.log( "Error:", error );
      }
    });
    client.on( "ready", () => console.log( `Logged in as ${ client.user.tag }!` ));
    client.on( "error", console.error );
    client.on( "reconnect", () => console.log( "Reconnecting" ));
    client.login( token )
    .catch( ( error ) => console.log( "Error:", error ) );
  }
}

if ( typeof module !== "undefined" && module.exports) {
    module.exports = comfyDiscord;
}
