const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const Messages = db.messages;

exports.getMessage = (req, res) => {
  Messages.findAll({
    where: {
      [Op.or]: [
        { [Op.and]: { to: req.body.from, from: req.body.to } },
        { [Op.and]: { from: req.body.from, to: req.body.to } },
      ],
    },
  }).then((result) => {
    formatResult(res, 200, true, "Success Get History", result);
  });
};
