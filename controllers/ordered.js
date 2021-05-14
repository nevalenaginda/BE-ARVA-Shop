const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const { coreApi, CreateTrx } = require("../helpers/corePayment");
const { picProduct } = require("../models");
const Ordered = db.ordered;
const Product = db.product;

exports.makeOrder = async (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  req.body.productId = JSON.parse(req.body.productId);
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
                price: resultFindProduct.price,
                name: resultFindProduct.name,
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
    const orderId = `${moment(new Date()).unix()}-${Math.floor(Math.random() * 100)}`;
    const resultItem = dataOrder.map((item) => {
      return {
        id: item.productId,
        price: parseInt(item.price),
        quantity: item.quantity,
        name: item.name,
      };
    });
    const resultTotalPayment = resultItem.map((item) => {
      return {
        totalPayment: parseInt(item.price) * parseInt(item.quantity),
      };
    });
    const dataPayment = {
      orderId,
      emailUser: req.body.email,
      itemDetails: resultItem,
      totalPayment:
        resultTotalPayment.map((item) => item.totalPayment).reduce((a, b) => a + b, 0) +
        parseInt(dataBody.deliveryCost),
    };
    CreateTrx(coreApi, dataPayment)
      .then((resultPayment) => {
        if (resultPayment.status_code === "201") {
          const dataCreate = dataOrder.map((item) => {
            return {
              ...item,
              orderId,
              methodPayment: "bank_transfer",
              totalPayment: dataPayment.totalPayment,
              vaNumber: resultPayment.va_numbers[0].va_number,
            };
          });
          Ordered.bulkCreate(dataCreate).then(() => {
            formatResult(res, 201, true, "Success Make Order", resultPayment);
          });
        } else {
          formatResult(res, 400, false, "Bad Request", null);
        }
      })
      .catch((err) => {
        formatResult(res, 500, false, err, null);
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
  if (req.query.status && req.query.status !== "") {
    Ordered.findAll({ where: { status: req.query.status } })
      .then(async (resultAllOrder) => {
        console.log(resultAllOrder)
        for (let i in resultAllOrder) {
          await Product.findOne({
            where: { id: resultAllOrder[i].productId, seller: userId },
          }).then(async (resultProduct) => {
            if (resultProduct) {
              const status = await coreApi.transaction.status(resultAllOrder[i].orderId);
              if (status.transaction_status === "pending") {
                arrOrder.push({
                  ...resultAllOrder[i].dataValues,
                  transactionStatus: status.transaction_status,
                });
              } else {
                if(resultAllOrder[i].status !== "process"){
                await Ordered.update(
                  { status: "process" },
                  { where: { id: resultAllOrder[i].id } }
                );
                }
              }
            }
          });
        }
        formatResult(res, 200, true, "Success Order By Status", arrOrder);
      })
      .catch(() => {
        formatResult(res, 500, false, "Internal Server Error", null);
      });
  } else {
    Ordered.findAll()
      .then(async (resultAllOrder) => {
        for (let i in resultAllOrder) {
          const status = await coreApi.transaction.status(resultAllOrder[i].orderId);
          if (status.transaction_status !== "pending") {
            if (status.transaction_status === "expire") {
              await Ordered.update(
                { status: "cancelled" },
                { where: { id: resultAllOrder[i].id } }
              );
            } else if(resultAllOrder[i].status !== "process"){
              if(resultAllOrder[i].status !== "completed"){
              await Ordered.update( {status: "process"}, {where:{id:resultAllOrder[i].id}})
              }
            }
          }
          await Product.findOne({
            where: { id: resultAllOrder[i].productId, seller: userId },
          }).then((resultProduct) => {
            if(resultProduct){
            picProduct.findOne({ where: { productId: resultProduct.id } }).then((resultPic) => {
              if (resultPic) {
                arrOrder.push({
                  id: resultAllOrder[i].orderId,
                  orderId: resultAllOrder[i].id,
                  productId: resultAllOrder[i].productId,
                  nameProduct: resultProduct.name,
                  imageProduct: `${process.env.HOST}/images/${resultPic.image}`,
                  quantity: resultAllOrder[i].quantity,
                  nameSeller: resultAllOrder[i].seller,
                  userId: resultAllOrder[i].userId,
                  quantity: resultAllOrder[i].quantity,
                  transactionStatus: status.transaction_status,
                  status:
                    status.transaction_status !== "pending"
                      ? status.transaction_status === "expire"
                        ? "cancelled"
                        : resultAllOrder[i].status
                      : "pending",
                  totalPayment: resultAllOrder[i].totalPayment,
                });
              }
            });
            }
          });
        }
        formatResult(res, 200, true, "Success Order By Status", arrOrder);
      })
      .catch((err) => {
console.log(err)
        formatResult(res, 500, false, "Internal Server Error", null);
      });
  }
};

exports.updateStatusOrder = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Ordered.findOne({ where: { id: req.body.orderId } }).then((resultFindOrder) => {
    Product.findOne({ where: { id: resultFindOrder.productId, seller: userId } })
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

exports.getOrderUser = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  function cleanCondition(obj) {
    for (var propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === "null" ||
        obj[propName] === ""
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }
  const condition = {
    userId,
    status: req.query.status || null,
  };
  const arrOrder = [];
  Ordered.findAll({ where: cleanCondition(condition) })
    .then(async (resultAllOrder) => {

      if (resultAllOrder.length > 0) {
        for (let i in resultAllOrder) {
          const status = await coreApi.transaction.status(resultAllOrder[i].orderId);
          if (status.transaction_status !== "pending") {
            if (status.transaction_status === "expire") {
              await Ordered.update(
                { status: "cancelled" },
                { where: { id: resultAllOrder[i].id } }
              );
            } else {
              await Ordered.update({ status: "process" }, { where: { id: resultAllOrder[i].id } });
            }
          }
          await Product.findOne({
            where: { id: resultAllOrder[i].productId },
          }).then(async(resultProduct) => {
          await picProduct.findOne({ where: { productId: resultProduct.id } }).then((resultPic) => {
              if (resultPic) {
                arrOrder.push({
                  id: resultAllOrder[i].orderId,
                  productId: resultAllOrder[i].productId,
                  nameProduct: resultProduct.name,
                  imageProduct: `${process.env.HOST}/images/${resultPic.image}`,
                  quantity: resultAllOrder[i].quantity,
                  nameSeller: resultAllOrder[i].seller,
                  userId: resultAllOrder[i].userId,
                  quantity: resultAllOrder[i].quantity,
                  transactionStatus: status.transaction_status,
                  status:
                    status.transaction_status !== "pending"
                      ? status.transaction_status === "expire"
                        ? "cancelled"
                        : resultAllOrder[i].status
                      : "pending",
                  totalPayment: resultAllOrder[i].totalPayment,
                  vaNumber: status.va_numbers[0].va_number,
                });
              }
            });
          });
        }
        if (arrOrder.length > 0) {
          formatResult(res, 200, true, "Success Order By Status", arrOrder);
        } else {
          formatResult(res, 404, false, "Status Order Not Found", null);
        }
      } else {
        formatResult(res, 404, false, "Status Order Not Found", null);
      }
    })
    .catch((err) => {
      console.log(err)
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};
