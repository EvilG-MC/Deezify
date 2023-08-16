import { Event } from "../classes/Event";
import { client } from "..";
import { ActivityTypes } from "oceanic.js";

export default new Event("ready", async () => {
  console.log(`[🤖] Client ${client.user?.username} has been connected`);

  client.editStatus("idle", [
    {
      name: "Custom",
      state: "Awana bum ban ban wichobadio",
      type: ActivityTypes.CUSTOM,
    },
  ]);
});
