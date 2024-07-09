import multer from "multer";

const KB = 1024;
const MB = 1024 * KB;

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * MB,
  },
});

export default multerUpload;
