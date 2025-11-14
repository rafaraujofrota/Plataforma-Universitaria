import multer, { MulterError } from "multer";
import path from "path";
import crypto from "crypto";

export const uploadsDirPath = path.resolve(__dirname, "..", "..", "uploads")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadsDirPath); 
    },

    filename: (req, file, callback) => {
        const hash = crypto.randomBytes(10).toString("hex");
        const extension = path.extname(file.originalname);
        const filename = `${hash}-${Date.now()}${extension}`;
        callback(null, filename);
    }
});

function fileFilter(req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
    } else {
        callback(new MulterError("LIMIT_UNEXPECTED_FILE"));
    }
}

export const fileLimitMB = 12
 
// Limite de 12MB
const fileSize = fileLimitMB * 1024 * 1024 

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize }
});