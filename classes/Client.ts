import { Client, ClientEvents } from "oceanic.js";
import { QueueType } from "../typings/types";
import { Event } from "./Event";
import { readdirSync } from "fs";
import { join } from "node:path";

export class Deezify extends Client {
  queue: Map<string, QueueType> = new Map();

  constructor() {
    super({
      auth: `Bot ${process.env["Token"]}`,
      gateway: {
        concurrency: "auto",
        intents: [
          "GUILDS",
          "GUILD_MESSAGES",
          "GUILD_VOICE_STATES",
          "MESSAGE_CONTENT",
        ],
      },
    });
  }

  init() {
    this.connect();
    this.registerModules();
  }

  async importFile(path: string) {
    return (await import(path))?.default;
  }

  async registerModules() {
    const events_path = join(__dirname, "..", "events");
    const events = readdirSync(events_path).filter((file) =>
      file.endsWith(".ts")
    );

    events.forEach(async (path) => {
      const event_path = join(events_path, path);

      const event: Event<keyof ClientEvents> = await this.importFile(
        event_path
      );

      this.on(event.event, event.run);
    });
  }
}
