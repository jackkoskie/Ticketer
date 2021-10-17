import { Command, PieceContext } from "@sapphire/framework";
import { Message, MessageActionRow, MessageButton } from "discord.js";
import { Server } from "../models/serverModel";

export default class PingCommand extends Command {
    constructor(context: PieceContext) {
        super(context, {
            aliases: ['pong', 'latency'],
            description: 'Tests the latency.',
        });
    }

    async run(message: Message) {
        const response = await message.channel.send('Ping...');
        const latency = Date.now() - message.createdTimestamp;

        const pingRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticketerPingRerun')
                    .setLabel('Rerun')
                    .setEmoji('🔁')
                    .setStyle('SECONDARY')
            )

        await response.edit({
            content: `Pong! Took me ${latency}ms to reply.`,
            components: [pingRow]
        });
    }
}