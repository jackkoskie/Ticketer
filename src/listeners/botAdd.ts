import { Listener, PieceContext } from "@sapphire/framework";
import { Guild } from "discord.js";
import { client } from "..";

export default class botAddMessage extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            once: false,
            event: 'guildCreate'
        })
    }

    async run(guild: Guild) {
        const welcomeMessage = `Hey, thanks for adding ${client.user} to **${guild.name}**! To get started, run the \`${client.options.defaultPrefix}help\` in the server to see setup instructions.`

        if (guild.systemChannel) {
            guild.systemChannel.send(welcomeMessage);
            return;
        } else {
            try {
                const owner = await guild.fetchOwner();
                await owner.send(welcomeMessage);
                return;
            } catch { }
        }
    }
}