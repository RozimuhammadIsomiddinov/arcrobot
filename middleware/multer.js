import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fayllar saqlanadigan joy
const uploadPath = path.resolve(__dirname, "..", "public/images");

// Agar katalog mavjud bo‘lmasa, uni yaratamiz
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // To‘g‘ridan-to‘g‘ri `public/images/` ichiga saqlaymiz
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.originalname.replace(/\s+/g, "")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

export default upload;
