import { Schema, model } from "mongoose";

const schema = Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_, doc) => {
            doc.id = doc._id,
            delete doc.__v;
            delete doc._id;
        }
    }
});


export default model("Uploads", schema);