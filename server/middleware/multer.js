import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}) // Default disk storage (no custom path or filename)
});

export default upload;
