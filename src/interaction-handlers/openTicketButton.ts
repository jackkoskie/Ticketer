import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ButtonInteraction, GuildChannel, GuildManager, MessageActionRow, MessageButton } from "discord.js";
import { Server } from "../models/serverModel";

export default class openTicketButton extends InteractionHandler {
    constructor(ctx: PieceContext) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button })
    }

    async run(interaction: ButtonInteraction) {

        if (interaction.customId !== 'ticketerOpenTicket') return;
        await interaction.deferReply();

        //@ts-ignore
        let server: any = await Server.findOne({ id: interaction.message.guild?.id });
        if (!server.channel) return;

        //@ts-ignore
        const { channel, guild } = interaction.message

        let openTickets = await guild.channels.cache.get(server.channel).parent.id

        await channel.edit({
            // name: 'channel.name.replace('closed', 'open')',
            parent: openTickets
        })

        let openInfoRow = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('ticketerCloseTicket')
                    .setEmoji('❎')
                    .setLabel('Close')
                    .setStyle('DANGER')
                    .setDisabled(false),

                new MessageButton()
                    .setCustomId('ticketerOpenTicket')
                    .setEmoji('✅')
                    .setLabel('Open')
                    .setStyle('SUCCESS')
                    .setDisabled(true),

                new MessageButton()
                    .setCustomId('ticketerClaimTicket')
                    .setEmoji('👤')
                    .setLabel('Claim')
                    .setStyle('PRIMARY')
                    .setDisabled(false)
            ])

        //@ts-ignore
        interaction.message.edit({
            components: [openInfoRow]
        })

        await interaction.followUp({
            content: `Ticket opened by ${interaction.member}`
        })
    }

}