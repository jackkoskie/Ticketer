import { Listener, PieceContext } from "@sapphire/framework";
import { Guild } from "discord.js";
import { client } from "..";
import { Server } from "../models/serverModel";

export default class serverDBRemove extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            once: false,
            event: 'guildDelete'
        })
    }

    async run(guild: Guild) {
        Server.findOneAndDelete({
            id: guild.id
        });
    }
}