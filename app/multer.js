import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+"-"+file.originalname)
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype !== "text/plain") {
        return cb({ error: "Invalid file format" }, false)
    }

    return cb(null, true);
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter,
});

export default upload;