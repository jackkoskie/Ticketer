import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { BaseGuildTextChannel, ButtonInteraction, Message, } from "discord.js";
import { appendFile, unlink, writeFile } from "fs";
import fs from "fs";
import { fetchManyMessages } from "../utils/fetchMessage";

export default class transcriptButton extends InteractionHandler {
    constructor(ctx: PieceContext) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button })
    }

    async run(interaction: ButtonInteraction) {
        if (interaction.customId !== 'ticketerCreateTranscript') return;
        interaction.deferReply({ ephemeral: true });

        //@ts-ignore
        const message: Message = interaction.message
        //@ts-ignore
        const channel: BaseGuildTextChannel = message.channel

        const messages: any = await fetchManyMessages(channel).catch(err => console.error(err));

        let formattedMessages: string[] = [];
        await messages.forEach((message: Message) => {
            return formattedMessages.push(`${message.author.tag} - [${new Date(message.createdTimestamp)}]: ${message.content}`);
        });
        formattedMessages.reverse()

        //@ts-ignore
        writeFile(`./${message.channel.name}-transcript.txt`, `Ticketer Transcript\nCreated time: ${new Date(Date.now())}\nCreated By: ${interaction.member.user.tag}\n\n${formattedMessages.join('\n')}`, (err) => { if (err) console.error(err) })

        await interaction.followUp({
            content: 'Your transcript is ready for download!',
            ephemeral: true,
            //@ts-ignore
            files: [{ attachment: `./${message.channel.name}-transcript.txt`, name: 'transcript.txt' },]
        });

        //@ts-ignore
        unlink(`./${message.channel.name}-transcript.txt`, (err) => {
            if (err) console.error(err);
        })
    }

}