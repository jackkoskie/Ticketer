import { Listener, PieceContext } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton, MessageEmbedOptions } from 'discord.js';
import { client } from '..';
import { Server } from '../models/serverModel';
import { Ticket } from '../models/ticketModel';

export default class SupportRequestListener extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            once: false,
            event: 'messageCreate',
        });
    }

    async run(message: Message) {
        let avatar = message.author.displayAvatarURL();
        if (message.author.bot || message.content.startsWith(`${client.options.defaultPrefix}`) || message.channel.type != 'GUILD_TEXT' || message.content === 'yes') return;

        let server: any = await Server.findOne({ id: message.guild?.id });
        if (!server) return;

        if (message.channel.id != server.channel) return;

        const creatingMessage = await message.reply('Creating support ticket');
        const supportChannel = await message.guild?.channels.create(`${message.author.tag}`, {
            type: 'GUILD_TEXT',
            parent: message.channel.parent?.id,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    allow: ['SEND_MESSAGES', 'ADD_REACTIONS', 'ATTACH_FILES', 'EMBED_LINKS'],
                    deny: ['VIEW_CHANNEL', 'CREATE_INSTANT_INVITE']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL']
                },
                {
                    id: server.supportRole,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        });

        let infoRow = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('ticketerCloseTicket')
                    .setEmoji('❎')
                    .setLabel('Close')
                    .setStyle('DANGER'),

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
            ])

        const infoMessage = await supportChannel?.send({
            content: `( ${message.author} | <@&${server.supportRole}> )  -  New Ticket`,
            embeds: [{
                title: `Support Ticket`,
                fields: [
                    {
                        name: 'Ticket Info',
                        value: `**Username:** ${message.author.tag}\n**Nickname:** ${message.guild?.members.cache.get(message.author.id)?.nickname || '*No Nickname*'}`,
                        inline: true
                    },
                ]
            }],
            components: [infoRow]
        })

        await Ticket.create({
            _id: supportChannel?.id,
            creator: message.author.id,
            messageContent: message.content,
            guild: message.guild?.id
        });

        await supportChannel?.createWebhook('Ticketer').then(webhookClient => {
            webhookClient.send({
                content: `${message.content}`,
                username: `${message.guild?.members.cache.get(message.author.id)?.displayName}`,
                avatarURL: avatar
            })
        });

        creatingMessage.edit(`Created support ticket: ${supportChannel}`);

        setTimeout(() => {
            creatingMessage.delete();
            message.delete();
        }, 5 * 1000);
    }
}