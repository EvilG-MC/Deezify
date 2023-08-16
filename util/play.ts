import {
  ButtonStyles,
  ComponentTypes,
  Guild,
  TextChannel,
  VoiceChannel,
} from "oceanic.js";
import { Deezify } from "../classes/Client";
import { DeezerTrack } from "deezer-search";
import { request } from "undici";
import { Readable } from "node:stream";
import {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { QueueType } from "../typings/types";

export default async function play(
  client: Deezify,
  guild: Guild,
  track: DeezerTrack
) {
  const guild_queue = client.queue.get(guild.id) as QueueType;
  const text_channel = guild.channels.get(
    guild_queue.text_channel as string
  ) as TextChannel;
  const voice_channel = guild.channels.get(
    guild_queue.voice_channel as string
  ) as VoiceChannel;

  if (!track) {
    const connection = getVoiceConnection(guild.id);

    if (connection) {
      text_channel
        .createMessage({
          embeds: [
            {
              description:
                "**`❌` No more tracks left**\nLeaving the voice channel...",
              color: 0x2b2d31,
            },
          ],
        })
        .catch(() => null);

      connection.disconnect();
      client.queue.delete(guild.id);
    }
  } else {
    await request(`${process.env["API"]}/track/decrypt/${track.id}/audio.mp3`, {
      headers: {
        Authorization: process.env["APIBearer"],
      },
    }).then(async (response) => {
      if (response.statusCode === 200) {
        const connection = joinVoiceChannel({
          channelId: voice_channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
          selfMute: true,
          selfDeaf: true,
        });

        const response_decrypt = await response.body.blob();
        const array_buffer = await response_decrypt.arrayBuffer();

        const stream_audio = new Readable({
          read() {
            this.push(Buffer.from(array_buffer));
            this.push(null);
          },
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(stream_audio, {
          inputType: StreamType.Arbitrary,
        });

        guild_queue.audio_player = player;

        player.play(resource);
        connection.subscribe(player);

        text_channel
          .createMessage({
            embeds: [
              {
                description: `**\`🎶\` Now playing: [${track.title}](${track.url})**`,
                fields: [
                  {
                    name: "`👤` Artist",
                    value: track.artist.name,
                    inline: true,
                  },
                  {
                    name: "`🔞` Explicit",
                    value: track.explicit ? "✅ Yes" : "❌ No",
                    inline: true,
                  },
                ],
                color: 0x2b2d31,
              },
            ],
            components: [
              {
                type: ComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: ComponentTypes.BUTTON,
                    customID: "player-pause",
                    emoji: {
                      name: "⏯️",
                    },
                    style: guild_queue.paused
                      ? ButtonStyles.SUCCESS
                      : ButtonStyles.SECONDARY,
                  },
                  {
                    type: ComponentTypes.BUTTON,
                    customID: "player-skip",
                    emoji: {
                      name: "⏭️",
                    },
                    style: ButtonStyles.SECONDARY,
                  },
                  {
                    type: ComponentTypes.BUTTON,
                    customID: "player-destroy",
                    emoji: {
                      name: "⏹️",
                    },
                    style: ButtonStyles.DANGER,
                  },
                ],
              },
            ],
          })
          .catch(() => null);

        player.on(AudioPlayerStatus.Idle, async () => {
          if (guild_queue.tracks.length) {
            if (guild_queue.track_loop) {
              await play(client, guild, guild_queue.tracks[0]);
            } else {
              guild_queue.tracks.shift();

              await play(client, guild, guild_queue.tracks[0]);
            }
          }
        });
      }
    });
  }
}
