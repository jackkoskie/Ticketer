import { Listener, PieceContext, SapphireClient } from '@sapphire/framework';

export default class rateLimit extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            event: 'rateLimit',
        });
    }

    async run(rateLimitInfo: any) {
        // console.warn(rateLimitInfo)
    }
}