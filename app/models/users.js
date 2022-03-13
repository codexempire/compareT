import { Schema, model } from "mongoose";

const schema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lower: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamp: true,
    toJSON: {
        transform: (_, doc) => {
            doc.id = doc._id;
            delete doc._id;
            delete doc.__v;
            doc.password = !!doc.password;
        }
    }
})

export default model("Users", schema);