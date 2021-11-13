// Invite: https://discord.com/api/oauth2/authorize?client_id=891340733582299186&permissions=8&scope=bot%20applications.commands

import { SapphireClient } from "@sapphire/framework";

//@ts-ignore
import env from "dotenv";
import { connect, connection } from "mongoose";
import { time } from "./utils/date";
env.config()

if (!Date.now) {
    Date.now = function () { return new Date().getTime(); }
}

const client = new SapphireClient({
    defaultPrefix: process.env.PREFIX,
    intents: '14071',
    presence: { status: 'online', activities: [{ name: 'for tickets! | t.help', type: 'WATCHING' }] },
    loadDefaultErrorListeners: true,
    defaultCooldown: {
        limit: 1,
        delay: 3,
    },
});
export { client };

const mongoConnection = connect(process.env.MONGO_URI || '');
connection.on('connected', () => { console.info(`[${time()}] Connected to MongoDB`) });
connection.on('error', () => { console.info(`[${time()}] Failed Connection to MongoDB`) });
connection.on('disconnected', () => { console.info(`[${time()}] Disconnected from MongoDB`) });
export { mongoConnection };

client.login(process.env.TOKEN);