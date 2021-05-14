const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const Address = db.address;

exports.addAddress = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  req.body.userId = userId;
  Address.findAll({ where: { userId, isPrimary: true } }).then(async (resultAllAddressPrimary) => {
    if (resultAllAddressPrimary.length < 0) {
      req.body.isPrimary = true;
    }
    Address.create(req.body)
      .then((result) => {
        formatResult(res, 200, true, "Success Add Address", result);
      })
      .catch(() => {
        formatResult(res, 500, false, "Internal Server Error", null);
      });
  });
};

exports.getListAddress = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Address.findAll({ where: { userId } })
    .then((result) => {
      formatResult(res, 200, true, "Success Get List Address", result);
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.editAddress = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Address.findAll({ where: { userId, isPrimary: true } }).then(async (resultAllAddress) => {
    if (resultAllAddress.length > 0) {
      await Address.update({ isPrimary: false }, { where: { id: resultAllAddress[0].id } });
    }
    Address.update(req.body, { where: { id: req.query.id, userId } })
      .then((result) => {
        if (result[0] === 1) {
          Address.findOne({ where: { id: req.query.id } }).then((resultNewAddress) => {
            formatResult(res, 200, true, "Success Edit Address", resultNewAddress);
          });
        }
      })
      .catch(() => {
        formatResult(res, 500, false, "Internal Server Error", null);
      });
  });
};

exports.deleteAddress = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Address.findOne({ where: { userId, id: req.query.id } })
    .then((resultFind) => {
      if (resultFind) {
        Address.destroy({ where: { id: req.query.id } }).then(() => {
          Address.findAll({ where: { userId, isPrimary: true } }).then(
            (resultAllAddressPrimary) => {
              if (resultAllAddressPrimary.length < 0) {
                Address.findAll({ where: { userId } }).then(async (resultAllAddress) => {
                  if (resultAllAddress.length > 0) {
                    await Address.update(
                      { isPrimary: true },
                      { where: { userId, id: resultAllAddress[0].id } }
                    );
                  }
                });
              }
            }
          );
          formatResult(res, 200, true, "Success Delete Address", null);
        });
      } else {
        formatResult(res, 404, false, "Address Not Found");
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};
