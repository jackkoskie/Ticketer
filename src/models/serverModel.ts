import { model, Schema } from "mongoose";

const serverSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    supportRole: {
        type: String,
        required: true
    },
})

const Server = model('Server', serverSchema);
export { Server };