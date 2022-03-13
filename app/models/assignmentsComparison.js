import mongoose, { Schema, model } from "mongoose";

const schema = Schema({
    assignment1: {
        type: mongoose.Types.ObjectId,
        ref: "Uploads",
    },
    assignment2: {
        type: mongoose.Types.ObjectId,
        ref: "Uploads",
    },
    comparisonPercentage: {
        type: Number,
        required: true,
    },
    staff: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
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


export default model("Assignments-Comparison", schema);