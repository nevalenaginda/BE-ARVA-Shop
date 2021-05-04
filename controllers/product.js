const db = require("../models");
const formatResult = require("../helpers/formatResult");
const { getToken, decodeToken, verifyToken } = require("../helpers/jwtHelper");
const { Op } = require("sequelize");
const Product = db.product;
const picProduct = db.picProduct;
const User = db.user;

exports.sellProduct = (req, res) => {
  const verify = verifyToken(req);
  if (verify !== true) return formatResult(res, 400, false, verify, null);
  const decode = decodeToken(req);
  req.body.seller = decode.userId;
  const role = decode.role;
  if (role === "seller") {
    Product.create(req.body).then((result) => {
      if (req.body.image) {
        const images = JSON.parse(req.body.image);
        picProduct
          .bulkCreate(
            images.map((item) => {
              return {
                ...item,
                productId: result.id,
              };
            })
          )
          .then((results) => {
            formatResult(res, 201, true, "Success Sell Product", {
              id: result.id,
              name: result.name,
              price: result.price,
              stock: result.stock,
              condition: result.condition,
              image: JSON.stringify(
                results.map((item) => `${process.env.HOST}/images/${item.image}`)
              ),
              description: result.description,
            });
          });
      }
    });
  } else {
    formatResult(res, 400, false, "Only Admin Can Sell Product", null);
  }
};

exports.getNewProduct = (req, res) => {
  let curr = new Date();
  let first = curr.getDate() - 2;
  Product.findAll({
    where: {
      createdAt: {
        [Op.between]: [
          new Date(`${curr.getFullYear()}-${curr.getMonth() + 1}-${first} 07:00:00`),
          new Date(),
        ],
      },
    },
    limit: 20,
  })
    .then((result) => {
      formatResult(res, 200, true, "Success Get New Product", result);
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.getPopularProduct = (req, res) => {
  Product.findAll({
    order: [["rating", "desc"]],
    limit: 20,
  })
    .then((result) => {
      formatResult(res, 200, true, "Success Get Popular Product", result);
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.homePageData = (req, res) => {
  let curr = new Date();
  let first = curr.getDate() - 2;
  Product.findAll({
    where: {
      createdAt: {
        [Op.between]: [
          new Date(`${curr.getFullYear()}-${curr.getMonth() + 1}-${first} 07:00:00`),
          new Date(),
        ],
      },
    },
    limit: 20,
  })
    .then((resultNew) => {
      Product.findAll({
        order: [["rating", "desc"]],
        limit: 20,
      })
        .then((resultPopular) => {
          formatResult(res, 200, true, "Success Get Homepage Data", {
            newProduct: resultNew,
            popularProduct: resultPopular,
          });
        })
        .catch(() => {
          formatResult(res, 500, false, "Internal Server Error", null);
        });
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.getDetailProduct = (req, res) => {
  Product.findOne({ where: { id: req.query.id } })
    .then((resultProduct) => {
      if (resultProduct) {
        User.findOne({ where: { userId: resultProduct.seller } }).then((resultSeller) => {
          if (resultSeller) {
            formatResult(res, 200, true, "Success Get Detail Product", {
              name: resultProduct.name,
              sellerName: resultSeller.name,
              sellerId: resultSeller.userId,
              price: resultProduct.price,
              color: resultProduct.color,
              size: resultProduct.size,
              stock: resultProduct.stock,
              brand: resultProduct.brand,
              condition: resultProduct.condition,
              description: resultProduct.description,
              category: resultProduct.category,
              ratingTotal: 0, // Dummy Data
              rating: {
                // Dummy Data
                star1: 0,
                star2: 0,
                star3: 0,
                star4: 0,
                star5: 4,
              },
            }).catch(() => {
              formatResult(res, 500, false, "Internal Server Error", null);
            });
          } else {
            formatResult(res, 404, false, "Seller Not Found", null);
          }
        });
      } else {
        formatResult(res, 404, false, "Product Not Found", null);
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.getRecommendationProduct = (req, res) => {
  if (req.query.category) {
    Product.findAll({ where: { category: req.query.category }, limit: 10 }).then((result) => {
      formatResult(res, 200, true, "Success Get Recommendation Product", result);
    });
  } else {
    Product.findAll({ limit: 10 }).then((result) => {
      formatResult(res, 200, true, "Success Get All Product", result);
    });
  }
};

exports.detailsPageData = (req, res) => {
  Product.findOne({ where: { id: req.query.id } })
    .then((resultProduct) => {
      if (resultProduct) {
        User.findOne({ where: { userId: resultProduct.seller } }).then((resultSeller) => {
          if (resultSeller) {
            Product.findAll({ where: { category: resultProduct.category }, limit: 10 }).then(
              (resultRecom) => {
                formatResult(res, 200, true, "Success Get Detail Product", {
                  detailsProduct: {
                    name: resultProduct.name,
                    sellerName: resultSeller.name,
                    sellerId: resultSeller.userId,
                    price: resultProduct.price,
                    color: resultProduct.color,
                    size: resultProduct.size,
                    stock: resultProduct.stock,
                    brand: resultProduct.brand,
                    condition: resultProduct.condition,
                    description: resultProduct.description,
                    category: resultProduct.category,
                    ratingTotal: 0, // Dummy Data
                    rating: {
                      // Dummy Data
                      star1: 0,
                      star2: 0,
                      star3: 0,
                      star4: 0,
                      star5: 4,
                    },
                  },
                  recommendationProduct: resultRecom,
                });
              }
            );
          } else {
            formatResult(res, 404, false, "Seller Not Found", null);
          }
        });
      } else {
        formatResult(res, 404, false, "Product Not Found", null);
      }
    })
    .catch(() => {
      formatResult(res, 500, false, "Internal Server Error", null);
    });
};

exports.getProductByCategory = (req, res) => {
  Product.findAll({ where: { category: req.query.category } }).then((result) => {
    formatResult(res, 200, true, "Success Get Product By Category", result);
  });
};
