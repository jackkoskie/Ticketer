import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";

export default class pingButton extends InteractionHandler {
    constructor(ctx: PieceContext) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button })
    }

    async run(interaction: ButtonInteraction) {
        if (interaction.customId !== 'ticketerPingRerun') return;
        // interaction.deferUpdate();

        //@ts-ignore
        const latency = Date.now() - interaction.createdTimestamp;

        const pingRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticketerPingRerun')
                    .setLabel('Rerun')
                    .setEmoji('🔁')
                    .setStyle('SECONDARY')
            )

        await interaction.update({
            content: `Pong! Took me ${latency}ms to reply.`,
            components: [pingRow]
        });
    }

}