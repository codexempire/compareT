import express from 'express';
import cors from 'cors';
import {
    config
} from 'dotenv';
import mongoose from 'mongoose';
import setupRouting from "./routes/index";
import "./uploads/upload";


config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const connectToDB = async () => {
    try {
        const mongoURL = process.env.MONGODB_URL;
        const dbName = process.env.DATABASE_NAME;

        if (!mongoURL || !dbName) {
            throw new Error("Failed to connect as the connection vairables are not present.")
        }

        await mongoose.connect(`${mongoURL}/${dbName}`);

        console.log("Connected to the mongo database");

    } catch (error) {
        console.log(error.message)
        throw error
    }
}



(async function () {
    await connectToDB()

    const port = process.env.PORT || 3000;

    setupRouting(app);
    app.listen(port)
})()
    .then(() => console.log("Server Started"))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

