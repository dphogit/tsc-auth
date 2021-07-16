import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/photos");
  },
  filename: (_, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `${uuidv4()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const { mimetype } = file;
  if (
    mimetype === "image/png" ||
    mimetype === "image/jpg" ||
    mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  limits: {
    fileSize: 1000000, // ONE MB
  },
  fileFilter: fileFilter,
  storage: storage,
});

export default upload;
