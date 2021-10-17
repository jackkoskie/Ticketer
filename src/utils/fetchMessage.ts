import { BaseGuildTextChannel, TextChannel } from "discord.js";

/**
 * Surcumvents the 100 message limit 
 * @param channel Channel for which the messages are fetched from
 * @param limit Max amount of messages to be fetched (Default: 500)
 * @returns Array of messages
 */
export async function fetchManyMessages(channel: TextChannel | BaseGuildTextChannel, limit = 500) {
    return new Promise(async resolve => {
        const sum_messages = [];
        let last_id;

        while (true) {
            let options = { limit: 100 };
            if (last_id) {
                //@ts-ignore
                options.before = last_id;
            }

            const messages = await channel.messages.fetch(options);
            sum_messages.push(...messages.values());
            last_id = messages.last()?.id;

            if (messages.size != 100 || sum_messages.length >= limit) {
                break;
            }
        }

        resolve(sum_messages);
    })
}