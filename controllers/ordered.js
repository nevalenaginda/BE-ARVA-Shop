const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const Ordered = db.ordered;
const Product = db.product;

exports.makeOrder = async (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  const arrIdProduct = JSON.parse(req.body.productId);
  const resultArr = [];
  for (let i in arrIdProduct) {
    await Product.findOne({ where: { id: arrIdProduct[i] } }).then(async (resultFindProduct) => {
      if (resultFindProduct) {
        req.body.userId = userId;
        req.body.productId = arrIdProduct[i];
        const resultOrder = await Ordered.create(req.body);
        resultArr.push(resultOrder.dataValues);
      }
    });
  }
  formatResult(res, 201, true, "Success Make Order", resultArr);
};
