import { model, Schema } from "mongoose";

const requiredString = {
    type: String,
    required: true
}

const ticketSchema = new Schema({
    _id: requiredString,
    creator: requiredString,
    messageContent: requiredString,
    guild: requiredString,
    status: { // Open: 0, Claimed: 1, Closed: 2
        type: Number,
        required: true,
        default: 0
    }
})

const Ticket = model('Ticket', ticketSchema);
export { Ticket };