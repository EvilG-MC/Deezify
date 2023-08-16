import { config } from "dotenv";
config();

import { Deezify } from "./classes/Client";

export const client = new Deezify();

client.init();
