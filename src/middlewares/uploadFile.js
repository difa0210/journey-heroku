const multer = require("multer");

exports.uploadFile = (ImageFile) => {
  // storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    // file name
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === ImageFile) {
      if (!file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image file are allowed",
        };
        return cb(new Error("Only image file are allowed"), false);
      }
    }
    cb(null, true);
  };
  const sizeMb = 10;
  const maxSize = sizeMb * 1000 * 1000; // max size is 10mb

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      file: maxSize,
    },
  }).single(ImageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.file && !err)
        return res.status(400).send({
          message: "Please select file",
        });
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10Mb",
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};
