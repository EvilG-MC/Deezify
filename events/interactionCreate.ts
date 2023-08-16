import { getVoiceConnection } from "@discordjs/voice";
import { Event } from "../classes/Event";
import {
  AnyInteractionGateway,
  ButtonStyles,
  ComponentTypes,
  InteractionTypes,
  MessageFlags,
  TextButton,
} from "oceanic.js";
import { QueueType } from "../typings/types";
import { client } from "..";

export default new Event(
  "interactionCreate",
  async (interaction: AnyInteractionGateway) => {
    if (!interaction.guild) return;
    if (!interaction.channel) return;

    if (interaction.type === InteractionTypes.MESSAGE_COMPONENT) {
      if (interaction.data.componentType === ComponentTypes.BUTTON) {
        await interaction.deferUpdate().catch(() => null);

        switch (interaction.data.customID) {
          case "player-pause": {
            if (!interaction.member?.voiceState?.channelID) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` You need to be on a voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            if (
              interaction.guild.clientMember.voiceState?.channelID &&
              interaction.member.voiceState.channelID !==
                interaction.guild.clientMember.voiceState.channelID
            ) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description:
                      "`❌` You need to be on the same voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const connection = getVoiceConnection(
              interaction.guildID as string
            );

            if (!connection) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` Invalid bot connection",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const guild_queue = client.queue.get(
              interaction.guildID as string
            ) as QueueType;

            if (!guild_queue) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` The player is not active",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const pause_button = interaction.message.components[0]
              .components[0] as TextButton;

            if (guild_queue.paused) {
              guild_queue.paused = false;
              guild_queue.audio_player?.unpause();

              pause_button.style = ButtonStyles.SECONDARY;
            } else {
              guild_queue.paused = true;
              guild_queue.audio_player?.pause();

              pause_button.style = ButtonStyles.SUCCESS;
            }

            interaction.message
              .edit({
                components: interaction.message.components,
              })
              .catch(() => null);

            interaction.createFollowup({
              embeds: [
                {
                  description: `\`⏯️\` ${interaction.user.mention}: **${
                    guild_queue.paused ? "Paused" : "Resumed"
                  } the song**`,
                  color: 0x2b2d31,
                },
              ],
            });

            break;
          }
          case "player-skip": {
            if (!interaction.member?.voiceState?.channelID) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` You need to be on a voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            if (
              interaction.guild.clientMember.voiceState?.channelID &&
              interaction.member.voiceState.channelID !==
                interaction.guild.clientMember.voiceState.channelID
            ) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description:
                      "`❌` You need to be on the same voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const connection = getVoiceConnection(
              interaction.guildID as string
            );

            if (!connection) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` Invalid bot connection",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const guild_queue = client.queue.get(
              interaction.guildID as string
            ) as QueueType;

            if (!guild_queue) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` The player is not active",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            if (!guild_queue.tracks[0] || guild_queue.tracks.length <= 1) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` There are no more songs to skip",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            guild_queue.skipped = true;
            guild_queue.audio_player?.stop();

            interaction.createFollowup({
              embeds: [
                {
                  description: `\`⏭️\` ${interaction.user.mention}: **Skipped**`,
                  color: 0x2b2d31,
                },
              ],
            });

            break;
          }
          case "player-destroy": {
            if (!interaction.member?.voiceState?.channelID) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` You need to be on a voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            if (
              interaction.guild.clientMember.voiceState?.channelID &&
              interaction.member.voiceState.channelID !==
                interaction.guild.clientMember.voiceState.channelID
            ) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description:
                      "`❌` You need to be on the same voice channel",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const connection = getVoiceConnection(
              interaction.guildID as string
            );

            if (!connection) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` Invalid bot connection",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            const guild_queue = client.queue.get(
              interaction.guildID as string
            ) as QueueType;

            if (!guild_queue) {
              return interaction.createFollowup({
                embeds: [
                  {
                    description: "`❌` The player is not active",
                    color: 0x2b2d31,
                  },
                ],
                flags: MessageFlags.EPHEMERAL,
              });
            }

            client.queue.delete(interaction.guildID as string);
            connection.destroy();

            interaction.createFollowup({
              embeds: [
                {
                  description: `\`⏹️\` ${interaction.user.mention}: **Destroyed the player**`,
                  color: 0x2b2d31,
                },
              ],
            });

            break;
          }
        }
      }
    }
  }
);
