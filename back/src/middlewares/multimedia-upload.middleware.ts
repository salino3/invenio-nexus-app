import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    // Prefix based on field name
    const prefix = file.fieldname === "logo" ? "company-logo" : "company-media";
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

export const uploadCompanyAssets = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "multimedia_files", maxCount: 10 },
]);
