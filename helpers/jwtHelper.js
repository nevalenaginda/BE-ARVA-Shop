const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getToken: (value) => {
    try {
      const token = jwt.sign(value, process.env.SECRET_KEY, { expiresIn: "1d" });
      return token;
    } catch (error) {
      return new Error(error).message;
    }
  },
  decodeToken: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      return decode;
    } catch (error) {
      return new Error(error).message;
    }
  },
  verifyToken: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY);
      return true;
    } catch (error) {
      return new Error(error).message;
    }
  },
  getTokenRefresh: (value) => {
    try {
      const token = jwt.sign(value, process.env.SECRET_KEY_REFRESH, { expiresIn: "30d" });
      return token;
    } catch (error) {
      return new Error(error).message;
    }
  },
  decodeTokenRefresh: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY_REFRESH);
      return decode;
    } catch (error) {
      return new Error(error).message;
    }
  },
  verifyTokenRefresh: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY_REFRESH);
      return true;
    } catch (error) {
      return new Error(error).message;
    }
  },
  getTokenReset: (value) => {
    try {
      const token = jwt.sign(value, process.env.SECRET_KEY_RESET, { expiresIn: "1h" });
      return token;
    } catch (error) {
      return new Error(error).message;
    }
  },
  decodeTokenReset: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY_RESET);
      return decode;
    } catch (error) {
      return new Error(error).message;
    }
  },
  verifyTokenReset: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY_RESET);
      return true;
    } catch (error) {
      return new Error(error).message;
    }
  },
  getTokenVerify: (value) => {
    try {
      const token = jwt.sign(value, process.env.SECRET_KEY_VERIF, { expiresIn: "1h" });
      return token;
    } catch (error) {
      return new Error(error).message;
    }
  },
  decodeTokenVerify: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY_VERIF);
      return decode;
    } catch (error) {
      return new Error(error).message;
    }
  },
  verifyTokenVerify: (req) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY_VERIF);
      return true;
    } catch (error) {
      return new Error(error).message;
    }
  },
};
