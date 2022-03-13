import cloudinary from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploads = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, {
            resource_type: "auto",
            folder
        }, (error, result) => {
            if (error) {
                reject({
                    error
                })
            }

            resolve({
                url: result.url,
                publicId: result.public_id,
            })
        })
    })
}