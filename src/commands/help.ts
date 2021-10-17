import { Command, PieceContext } from "@sapphire/framework";
import { Message } from "discord.js";
import { client } from "..";

export default class HelpCommand extends Command {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Instructions on how to setup the bot.'
        })
    }

    messageRun(message: Message) {
        const helpEmbed = {
            title: 'Setup Help',
            description: `To get started, create a channel, and name is somethings along the lines of \`#support\`. Create a role that will be able to respond to support tickets along the lines of \`@Support Team\`. Then navigate to this channel and run the command \`${client.options.defaultPrefix}setup <support role>\` to finalise the setup process. Please note if you run this command again it will overwrite the previous setup and the other will no longer work.\n\n> **Want to change the support role?**\n> Simply rerun the setup command with the new support role.\n\n> **Want to change channels?**\n> Simply rerun the setup command in the new channel and delete the old support message.`,
            timestamp: Date.now(),
            footer: {
                text: '© Ticketer, 2021'
            }
        }

        message.reply({ embeds: [helpEmbed] })
    }
}