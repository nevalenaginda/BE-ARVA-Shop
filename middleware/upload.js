const multer = require("multer");
const formatResult = require("../helpers/formatResult");
require("dotenv").config(); // Import env Config
const arrayData = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.route.path === "/" && req.route.stack[0].method === "put") {
      req.body.avatar = `${process.env.HOST}${process.env.STATIC_FOLDER}/${
        Date.now() + "_" + file.originalname
      }`;
      cb(null, "./upload");
    } else {
      cb(null, "./product_image");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const uploadSingle = (name) =>
  multer({
    storage: storage,
    limits: {
      fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  }).single(name);

const uploadMultiple = (name) =>
  multer({
    storage: storage,
    limits: {
      fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  }).array(name, 4);

const middleUpload = (key) => (req, res, next) => {
  if (key === "avatar") {
    uploadSingle(key)(req, res, (err) => {
      if (err) {
        if (err.message) {
          formatResult(res, 400, false, err.message, null);
        } else {
          formatResult(res, 400, false, "Only .png, .jpg and .jpeg format allowed!", null);
        }
      } else {
        next();
      }
    });
  } else {
    uploadMultiple(key)(req, res, (err) => {
      if (err) {
console.log(err)
        if (err.message) {
          formatResult(res, 400, false, err.message, null);
        } else {
          formatResult(res, 400, false, "Only .png, .jpg and .jpeg format allowed!", null);
        }
      } else {
        req.body.image = JSON.stringify(
          req.files.map((item) => {
            return { image: item.filename };
          })
        );
        next();
      }
    });
  }
};

module.exports = middleUpload;
