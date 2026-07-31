//
// * Comment it at the moment *

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Define destination path
// const uploadDir = path.join(__dirname, "../../public/uploads");

// // Ensure directory exists synchronously before handling uploads
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `company-logo-${uniqueSuffix}${ext}`);
//   },
// });

// export const uploadLogo = multer({ storage });
