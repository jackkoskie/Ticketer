import { Args, Command, PieceContext, UserError } from "@sapphire/framework";
import { Message } from "discord.js";
import { client } from "..";
import { Server } from "../models/serverModel";

export default class setupCommand extends Command {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Sets up the bot for the server.'
        })
    }

    async messageRun(message: Message, args: Command.ParsePreProcessResult<this>) {
        const { channel } = message;

        if (!message.member?.permissions.has("ADMINISTRATOR")) return message.reply("You don't have permission to do that!");

        if (channel.type != 'GUILD_TEXT') return message.reply('You can only use text channels as support channels.');

        //@ts-ignore
        if (!channel.parentId) return message.reply('Support channels must be in a category!')

        //@ts-ignore
        const supportRole = await args.pick('role').catch(() => {
            message.reply('You must provide a support role!');
            return;
        });
        if (!supportRole) return;

        const botMessage = await message.reply(`Are you sure you want to set ${message.channel} as a support channel and ${supportRole} as the support role? It will overwrite any other support channels in this server. Reply \'yes\' to confirm. (This message will expire in 30 seconds)`);

        const filter = (msg: Message) => { return msg.author.id === message.author.id };
        const collector = channel.createMessageCollector({
            filter,
            max: 1,
            time: 30 * 1000
        });

        collector.on('end', async collected => {
            if (collected.size === 0 || collected.first()?.content != 'yes') {
                setupCanceled(message, botMessage);
                return;
            } else {

                const runSetupMessage = await message.reply('Running setup...');
                const server = await Server.findOneAndUpdate(
                    {
                        _id: message.guild?.id
                    },
                    {
                        _id: message.guild?.id,
                        channel: channel.id,
                        supportRole: supportRole.id,
                    },
                    {
                        upsert: true
                    });

                // server.save();

                await message.guild?.channels.cache.get(channel.id)?.edit({
                    topic: '© Ticketer, 2021',
                    rateLimitPerUser: 300, // 5 min
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
                            deny: ['ADD_REACTIONS']
                        },
                        {
                            id: client.user?.id ?? '',
                            allow: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
                        }
                    ]
                });

                const supportTicketEmbed = {
                    title: 'Support Ticket',
                    fields: [
                        {
                            name: 'Create a Ticket',
                            value: 'To create a ticket, simply send your message in this channel and a ticket will be created for you.'
                        },
                        {
                            name: 'Can\'t send messages?',
                            value: 'There is a 5 minute cool down between creating tickets to prevent spam. Please wait this out before sending another message.'
                        }
                    ],
                    footer: {
                        text: '© Ticketer, 2021'
                    }
                }

                if (channel.type === 'GUILD_TEXT') {
                    let deleted;
                    do {
                        deleted = await channel.bulkDelete(100).catch(() => { });
                    } while (deleted?.size != 0);
                } else return;

                channel.send({ embeds: [supportTicketEmbed] });
                runSetupMessage.delete().catch(() => { });

                const yesMessage = collected.first();

                message.channel.send(`Setup completed in ${yesMessage ? ((Date.now() - yesMessage.createdTimestamp ?? 0) / 1000).toFixed(2) : 'an unknown amount of'} seconds. Thanks for using Ticketer!`).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(() => { });
                    }, 10 * 1000);
                })
                message.delete().catch(() => { });
                botMessage.delete().catch(() => { });
                collected.first()?.delete().catch(() => { });
            }
        });

    }
}

/**
 * Runs the steps for canceling the setup.  
 * @param userMessage Message Object of the users message
 * @param botMessage Message Object of the bots message
 */
const setupCanceled = (userMessage: Message, botMessage: Message) => {
    botMessage.edit('*Setup Canceled*');
    setTimeout(() => {
        userMessage.delete().catch(() => { });
        botMessage.delete().catch(() => { });
    }, 5 * 1000);
    return;
}