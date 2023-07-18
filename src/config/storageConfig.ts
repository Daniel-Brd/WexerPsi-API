import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const [, extension] = file.mimetype.split("/");

    cb(null, `${new Date().getTime()}.${extension}`);
  },
});

export const upload = multer({ storage });
