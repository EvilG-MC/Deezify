import { Event } from "../classes/Event";
import { Message } from "oceanic.js";
import play from "../util/play";
import { search } from "deezer-search";
import { client } from "..";

export default new Event("messageCreate", async (message: Message) => {
  const prefix = "dz";

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.channel) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  switch (command) {
    case "play": {
      if (!message.member?.voiceState?.channelID) {
        return message.channel.createMessage({
          embeds: [
            {
              description: "`❌` You need to be on a voice channel",
              color: 0x2b2d31,
            },
          ],
        });
      }

      if (
        message.guild.clientMember.voiceState?.channelID &&
        message.member.voiceState.channelID !==
          message.guild.clientMember.voiceState.channelID
      ) {
        return message.channel.createMessage({
          embeds: [
            {
              description: "`❌` You need to be on the same voice channel",
              color: 0x2b2d31,
            },
          ],
        });
      }

      const query = args.join(" ");

      if (!query) {
        return message.channel.createMessage({
          embeds: [
            {
              description: `**\`❌\` Invalid command usage**\n${prefix}play [song]`,
              color: 0x2b2d31,
            },
          ],
        });
      }

      const results = await search(query, {
        source: {
          deezer: "track",
        },
      });

      if (!results[0]) {
        return message.channel.createMessage({
          embeds: [
            {
              description: "`❌` The song has not been found",
              color: 0x2b2d31,
            },
          ],
        });
      }

      const track = results[0];

      message.createReaction("_:1133741806404776017");

      const guild_queue = client.queue.get(message.guild.id);

      if (!guild_queue) {
        client.queue.set(message.guild.id, {
          guild: message.guild,
          text_channel: message.channel.id,
          voice_channel: message.member.voiceState.channelID,
          tracks: [track],
          connection: null,
          volume: 75,
          playing: true,
          paused: false,
          skipped: false,
          track_loop: false,
          audio_player: undefined,
        });

        await play(client, message.guild, track);
      } else {
        guild_queue.tracks.push(track);
      }

      message.channel.createMessage({
        embeds: [
          {
            description: `\`✅\` The song **[${track.title}](${track.url})** has been added to the queue`,
            color: 0x2b2d31,
          },
        ],
      });

      break;
    }
  }
});
