import { Guild } from "oceanic.js";
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { DeezerTrack } from "deezer-search";

export type QueueType = {
  guild: Guild;
  text_channel: string;
  voice_channel: string;
  tracks: DeezerTrack[];
  connection: VoiceConnection | null;
  volume: number;
  playing: boolean;
  paused: boolean;
  skipped: boolean;
  track_loop: boolean;
  audio_player?: AudioPlayer | undefined;
};
