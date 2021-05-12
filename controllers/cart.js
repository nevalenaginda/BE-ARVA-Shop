const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const Product = db.product;
const Cart = db.cart;
const picProduct = db.picProduct;
const User = db.user;

exports.addCart = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  const productId = req.body.productId;
  const quantity = parseInt(req.body.quantity);

  Cart.findOne({ where: { productId, userId } })
    .then((resultFind) => {
      if (resultFind) {
        Cart.update({ quantity: quantity + resultFind.quantity }, { where: { productId } }).then(
          () => {
            Cart.findOne({ where: { productId } }).then((resultUpdate) => {
              formatResult(res, 200, true, "Success Update Cart", resultUpdate);
            });
          }
        );
      } else {
        req.body.userId = userId;
        Cart.create(req.body).then((resultCreate) => {
          formatResult(res, 201, true, "Success Add Cart", resultCreate);
        });
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.minCart = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  const productId = req.body.productId;

  Cart.findOne({ where: { productId, userId } })
    .then((resultFind) => {
      if (resultFind) {
        if (resultFind.quantity > 0) {
          Cart.update({ quantity: resultFind.quantity - 1 }, { where: { productId } }).then(() => {
            Cart.findOne({ where: { productId } }).then((resultUpdate) => {
              formatResult(res, 200, true, "Success Update Cart", resultUpdate);
            });
          });
        } else {
          Cart.update({ quantity: 0 }, { where: { productId } }).then(() => {
            Cart.findOne({ where: { productId } }).then((resultUpdate) => {
              formatResult(res, 200, true, "Success Update Cart", resultUpdate);
            });
          });
        }
      } else {
        formatResult(res, 400, false, "Cart Not Available", null);
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.getCart = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  Cart.findAll({ where: { userId } })
    .then(async (resultFind) => {
      if (resultFind.length > 0) {
        const newResult = [];
        // Added Detail Product To Result
        try {
          for (let i in resultFind) {
            await Product.findOne({ where: { id: resultFind[i].productId } }).then(
              async (resultProduct) => {
                if (resultProduct) {
                  await picProduct
                    .findAll({ where: { productId: resultProduct.id } })
                    .then(async (resultPic) => {
                      if (resultPic) {
                        await User.findOne({ where: { userId: resultProduct.seller } }).then(
                          async (resultSeller) => {
                            if (resultSeller) {
                              newResult.push({
                                ...resultFind[i].dataValues,
                                nameProduct: resultProduct.name,
                                imageProduct: resultPic.map(
                                  (item) => `${process.env.HOST}/images/${item.image}`
                                ),
                                nameSeller: resultSeller.nameStore,
                                stockProduct: resultProduct.stock,
                                totalPrice: parseInt(resultFind[i].quantity) * resultProduct.price,
                              });
                            }
                          }
                        );
                      }
                    });
                }
              }
            );
          }
          formatResult(res, 200, true, "Success Get Cart", {
            dataCart: newResult,
            totalPayment: newResult.map((item) => item.totalPrice).reduce((a, b) => a + b, 0),
          });
        } catch (error) {
          console.log(error);
          formatResult(res, 500, false, "Internal Server Error", null);
        }
      } else {
        formatResult(res, 400, false, "Cart Null");
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.deleteCart = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  const userId = decode.userId;
  console.log(req.body)
  Cart.destroy({ where: { id: JSON.parse(req.body.cartId), userId } })
    .then((resultDestroy) => {
      if (resultDestroy) {
        formatResult(res, 200, true, "Success Delete Cart", null);
      } else {
        formatResult(res, 400, false, "Cart Null", null);
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};
