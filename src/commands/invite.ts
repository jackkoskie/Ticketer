import { Command, PieceContext } from "@sapphire/framework";
import { Message } from "discord.js";
import { client } from "..";

export default class InviteCommand extends Command {
    constructor(context: PieceContext) {
        super(context, {
            description: 'A link to add the bot to your own server.'
        })
    }

    messageRun(message: Message) {
        message.reply(`https://discordapp.com/oauth2/authorize?client_id=${client?.user?.id}&permissions=805366864&scope=applications.commands%20bot`);
    }
}