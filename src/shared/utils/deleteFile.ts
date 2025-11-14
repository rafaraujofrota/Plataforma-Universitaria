import path from "path";
import fs from "fs"

import { uploadsDirPath } from "../../config/upload";

export default async function deleteFile(file: string) {
    const filePath = path.resolve(uploadsDirPath, file);

    try {
        await fs.promises.stat(filePath); // Checa se existe
    } catch {
        return;
    }

    await fs.promises.unlink(filePath);
}