const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const formatResult = require("../helpers/formatResult");
const bcrypt = require("bcrypt");
const { validAuthUser } = require("../helpers/validator");
const {
  getToken,
  decodeToken,
  verifyToken,
  getTokenReset,
  verifyTokenReset,
  decodeTokenReset,
  getTokenVerify,
  decodeTokenVerify,
  verifyTokenVerify,
  getTokenRefresh,
  decodeTokenRefresh,
} = require("../helpers/jwtHelper");
const sendMail = require("../middleware/mailer");
// const { Op } = require("sequelize");
const User = db.user;

exports.register = (req, res) => {
  const check = validAuthUser(req.body);
  if (check === true && req.body.email) {
    User.findOne({ where: { email: req.body.email } }).then(async (resultFind) => {
      if (resultFind) {
        return formatResult(res, 400, false, "Email Already Registered!", null);
      } else {
        req.body.userId = uuidv4();
        req.body.password = await bcrypt.hash(req.body.password, 10).then((result) => result);
        User.create(req.body)
          .then(() => {
            sendMail(req.body.email, {
              name: req.body.email.split("@")[0],
              text: `Sebelum Menggunakan Aplikasi Anda Harus Verifikasi Email`,
              url: `${process.env.DOMAIN}/verify?token=${getTokenVerify(req.body)}`,
              textBtn: "Verif Now",
            });
            formatResult(res, 201, true, "Success Register, Please Verify Your Email!", null);
          })
          .catch((err) => {
            formatResult(res, 500, false, err, null);
          });
      }
    });
  } else {
    formatResult(res, 400, false, "Some Field Cannot Be Empty", check[0]);
  }
};

exports.verify = (req, res) => {
  const verify = verifyTokenVerify(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeTokenVerify(req);
  const email = decode.email;
  User.findOne({ where: { email } }).then((resultCheck) => {
    if (resultCheck) {
      if (!resultCheck.dataValues.isActive) {
        User.update({ isActive: true }, { where: { email } })
          .then((result) => {
            if (result[0] === 1) {
              formatResult(res, 200, true, "Success Active Your Account!", null);
            } else {
              formatResult(res, 404, false, "Account Not Found", null);
            }
          })
          .catch((err) => {
            formatResult(res, 400, false, err, null);
          });
      } else {
        formatResult(res, 400, false, "Your Account Already Actived", null);
      }
    } else {
      formatResult(res, 404, false, "Account Not Found", null);
    }
  });
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const role = req.body.role;
  const checkEmail = await User.findOne({ where: { email, role }, order: ["email"] })
    .then((result) => result.dataValues)
    .catch(() => null);
  if (checkEmail) {
    if (!checkEmail.isActive) {
      formatResult(res, 400, false, "Email Not Verify, Please Verify Your Email!", null);
    } else {
      const password = bcrypt.compareSync(req.body.password, checkEmail.password);
      if (password) {
        delete checkEmail.password;
        const token = getToken(checkEmail);
        const refreshToken = getTokenRefresh(checkEmail);
        formatResult(res, 200, true, "Login Success", { ...checkEmail, token, refreshToken });
      } else {
        formatResult(res, 400, false, "Password Incorrect", null);
      }
    }
  } else {
    formatResult(
      res,
      400,
      false,
      `Your Email Not Registered as ${role === "user" ? "Customer" : "Seller"}`,
      null
    );
  }
};

exports.update = async (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  if (req.body.active) delete req.body.active;
  if (req.body.password) delete req.body.password;
  console.log(req.body);
  User.update(req.body, { where: { userId }, order: ["userId"] })
    .then(() => {
      User.findOne({ where: { userId }, order: ["userId"] })
        .then((results) => {
          delete results.dataValues.password;
          delete results.dataValues.secretPin;
          formatResult(res, 200, true, "Data Updated", results);
        })
        .catch((err) => {
          formatResult(res, 500, false, err, null);
        });
    })
    .catch((err) => {
      formatResult(res, 400, false, err, null);
    });
};

exports.requestResetPassword = (req, res) => {
  if (req.body.email) {
    const email = req.body.email;
    User.findOne({ where: { email }, order: ["email"] })
      .then((result) => {
        if (result) {
          const TokenReset = getTokenReset(req.body);
          sendMail(email, {
            name: req.body.email.split("@")[0],
            text: `Anda Melakukan Request Untuk Reset Password`,
            url: `${process.env.DOMAIN}/reset?token=${TokenReset}`,
            textBtn: "Reset Now",
          });
          formatResult(res, 200, true, "Success Request Reset Password", null);
        } else {
          formatResult(res, 404, false, "Email Not Registered", null);
        }
      })
      .catch((err) => {
        formatResult(res, 400, false, err, null);
      });
  } else {
    formatResult(res, 404, false, "Field Email Required", null);
  }
};

exports.resetPassword = async (req, res) => {
  const verify = verifyTokenReset(req);
  if (req.body.password && verify === true) {
    const decode = decodeTokenReset(req);
    const email = decode.email;
    req.body.password = await bcrypt.hash(req.body.password, 10).then((result) => result);
    User.update(req.body, { where: { email } })
      .then((result) => {
        if (result.length === 1) {
          formatResult(res, 200, true, "Success Reset Password", null);
        } else {
          formatResult(res, 500, false, "Internal Server Error", null);
        }
      })
      .catch((err) => {
        formatResult(res, 500, false, err, null);
      });
  } else {
    formatResult(res, 500, false, "Your Data Incorrect", null);
  }
};

exports.getNewToken = async (req, res) => {
  if (req.headers["authorization"]) {
    const checkEmail = decodeTokenRefresh(req);
    if (!checkEmail.active) {
      formatResult(res, 400, false, "Email Not Verify, Please Verify Your Email!", null);
    } else {
      delete checkEmail.iat;
      delete checkEmail.exp;
      const token = getToken(checkEmail);
      const refreshToken = getTokenRefresh(checkEmail);
      formatResult(res, 200, true, "Login Success", { ...checkEmail, token, refreshToken });
    }
  } else {
    formatResult(res, 400, false, "Email Not Registered", null);
  }
};

exports.resendMail = (req, res) => {
  const email = req.body.email;
  User.findOne({ where: { email } })
    .then(async (result) => {
      if (result) {
        if (!result.dataValues.active) {
          await sendMail(req.body.email, {
            name: req.body.email.split("@")[0],
            text: `Sebelum Menggunakan Aplikasi Anda Harus Verifikasi Email`,
            url: `${process.env.DOMAIN}/verify?token=${getTokenVerify(req.body)}`,
            textBtn: "Verif Now",
          });
          formatResult(res, 200, true, "Success Resend Verify Mail", null);
        } else {
          formatResult(res, 400, false, "Account Already Active", null);
        }
      } else {
        formatResult(res, 404, false, "Account Not Found", null);
      }
    })
    .catch((err) => {
      formatResult(res, 500, false, err, null);
    });
};

exports.getDetailUser = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  User.findOne({ where: { userId } })
    .then((resultFindUser) => {
      if (resultFindUser) {
        delete resultFindUser.password;
        formatResult(res, 200, true, "Success Get Detail User", resultFindUser);
      } else {
        formatResult(res, 400, false, "UserId Not Found!", null);
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};
