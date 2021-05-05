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
  req.body.productId = JSON.parse(JSON.parse(req.body.productId));
  req.body.userId = userId;
  const dataBody = req.body;
  const dataOrder = [];
  const dataOutStock = [];
  for (let i in dataBody.productId) {
    if (dataBody.productId[i]) {
      await Product.findOne({ where: { id: dataBody.productId[i].id } }).then(
        async (resultFindProduct) => {
          if (resultFindProduct) {
            if (resultFindProduct.stock - dataBody.productId[i].quantity >= 0) {
              if (resultFindProduct.stock - dataBody.productId[i].quantity === 0) {
                await Product.update(
                  {
                    stock: 0,
                    status: "sold out",
                  },
                  { where: { id: resultFindProduct.id } }
                );
              } else {
                await Product.update(
                  {
                    stock: resultFindProduct.stock - dataBody.productId[i].quantity,
                  },
                  { where: { id: resultFindProduct.id } }
                );
              }
              dataOrder.push({
                productId: resultFindProduct.id,
                userId,
                quantity: dataBody.productId[i].quantity,
                status: "pending",
                totalPayment: dataBody.totalPayment,
                deliveryCost: dataBody.deliveryCost,
                methodPayment: dataBody.methodPayment,
              });
            } else {
              dataOutStock.push(resultFindProduct.id);
            }
          }
        }
      );
    }
  }
  if (dataOrder.length === dataBody.productId.length) {
    Ordered.bulkCreate(dataOrder).then((resultBulk) => {
      formatResult(res, 201, true, "Success Make Order", resultBulk);
    });
  } else {
    if (dataOutStock.length > 0) {
      formatResult(res, 400, false, `Out of stock with productId ${dataOutStock.join(", ")}`, null);
    } else {
      formatResult(res, 400, false, "Failed Make Order", null);
    }
  }
};

exports.getOrderByStatus = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  const arrOrder = [];
  Ordered.findAll({ where: { status: req.query.status } })
    .then(async (resultAllOrder) => {
      for (let i in resultAllOrder) {
        await Product.findOne({ where: { id: resultAllOrder[i].productId, seller: userId } }).then(
          (resultProduct) => {
            if (resultProduct) {
              if (resultProduct.seller === userId) {
                arrOrder.push(resultAllOrder[i]);
              }
            }
          }
        );
      }
      formatResult(res, 200, true, "Success Order By Status", arrOrder);
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.updateStatusOrder = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Ordered.findOne({ where: { id: req.body.orderId } }).then((resultFindOrder) => {
    Product.findOne({ where: { id: resultFindOrder.id, seller: userId } })
      .then((resultProduct) => {
        if (resultProduct) {
          Ordered.update({ status: req.body.status }, { where: { id: req.body.orderId } }).then(
            () => {
              Ordered.findOne({ where: { id: req.body.orderId } }).then((updatedOrder) => {
                formatResult(res, 200, true, "Success Update Status Order", updatedOrder);
              });
            }
          );
        } else {
          formatResult(res, 400, false, "Product Not Found", null);
        }
      })
      .catch(() => {
        formatResult(res, 500, false, "Internal Server Error", null);
      });
  });
};
