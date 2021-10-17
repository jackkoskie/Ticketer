import { Listener, PieceContext, SapphireClient } from '@sapphire/framework';
import { Message } from 'discord.js';
import { time } from '../utils/date';

export default class ReadyListener extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            once: true,
            event: 'ready',
        });
    }

    async run(client: any) {
        const { tag, id } = client.user;
        console.info(`[${time()}] Successfully logged in as ${tag} (${id})`);
    }
}