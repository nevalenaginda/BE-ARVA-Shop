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
    Product.create(req.body)
      .then((result) => {
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
      })
      .catch((err) => {
        formatResult(res, 400, false, err.message, null);
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
      status: "ready",
    },
    limit: 20,
  })
    .then((resultNew) => {
      Product.findAll({
        order: [["rating", "desc"]],
        limit: 20,
      })
        .then(async (resultPopular) => {
          // Added Image For New Product
          const newProduct = [];
          for (let i in resultNew) {
            const resultSeller = await User.findOne({ where: { userId: resultNew[i].seller } });
            await picProduct
              .findAll({ where: { productId: resultNew[i].id } })
              .then((resultPic) => {
                if (resultPic) {
                  newProduct.push({
                    ...resultNew[i].dataValues,
                    sellerName: resultSeller.nameStore,
                    image: resultPic.map((item) => `${process.env.HOST}/images/${item.image}`),
                  });
                } else {
                  newProduct.push({ ...resultNew[i].dataValues });
                }
              });
          }
          // Added Image For Popular Product
          const popularProduct = [];
          for (let i in resultPopular) {
            const resultSeller = await User.findOne({ where: { userId: resultPopular[i].seller } });
            await picProduct
              .findAll({ where: { productId: resultPopular[i].id } })
              .then((resultPic) => {
                if (resultPic) {
                  popularProduct.push({
                    ...resultPopular[i].dataValues,
                    sellerName: resultSeller.nameStore,
                    image: resultPic.map((item) => `${process.env.HOST}/images/${item.image}`),
                  });
                } else {
                  popularProduct.push({ ...resultPopular[i].dataValues });
                }
              });
          }
          formatResult(res, 200, true, "Success Get Homepage Data", {
            newProduct,
            popularProduct,
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
        User.findOne({ where: { userId: resultProduct.seller } }).then(async (resultSeller) => {
          if (resultSeller) {
            await picProduct
              .findAll({ where: { productId: resultProduct.id } })
              .then((resultPicture) => {
                formatResult(res, 200, true, "Success Get Detail Product", {
                  id: resultProduct.id,
                  name: resultProduct.name,
                  image: resultPicture.map((item) => `${process.env.HOST}/images/${item.image}`),
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
    Product.findAll({ where: { category: req.query.category }, limit: 10 }).then(async (result) => {
      const newResult = [];
      for (let i in result) {
        const resultSeller = await User.findOne({ where: { userId: result[i].seller } });
        await picProduct.findAll({ where: { productId: result[i].id } }).then((resultPic) => {
          if (resultPic) {
            newResult.push({
              ...result[i].dataValues,
              sellerName: resultSeller.nameStore,
              image: resultPic.map((item) => `${process.env.HOST}/images/${item.image}`),
            });
          } else {
            newResult.push({ ...result[i].dataValues });
          }
        });
      }
      formatResult(res, 200, true, "Success Get Recommendation Product", newResult);
    });
  } else {
    Product.findAll({ limit: 10 }).then(async (result) => {
      const newResult = [];
      for (let i in result) {
        const resultSeller = await User.findOne({ where: { userId: result[i].seller } });
        await picProduct.findAll({ where: { productId: result[i].id } }).then((resultPic) => {
          if (resultPic) {
            newResult.push({
              ...result[i].dataValues,
              sellerName: resultSeller.nameStore,
              image: resultPic.map((item) => `${process.env.HOST}/images/${item.image}`),
            });
          } else {
            newResult.push({ ...result[i].dataValues });
          }
        });
      }
      formatResult(res, 200, true, "Success Get Recommendation Product", newResult);
    });
  }
};

exports.detailsPageData = (req, res) => {
  Product.findOne({ where: { id: req.query.id } })
    .then((resultProduct) => {
      if (resultProduct) {
        User.findOne({ where: { userId: resultProduct.seller } }).then((resultSeller) => {
          if (resultSeller) {
            picProduct.findAll((resultPic) => {
              Product.findAll({ where: { category: resultProduct.category }, limit: 10 }).then(
                async () => {
                  const newResult = [];
                  for (let i in result) {
                    const resultSeller = await User.findOne({
                      where: { userId: result[i].seller },
                    });
                    await picProduct
                      .findAll({ where: { productId: result[i].id } })
                      .then((resultPic) => {
                        if (resultPic) {
                          newResult.push({
                            ...result[i].dataValues,
                            sellerName: resultSeller.nameStore,
                            image: resultPic.map(
                              (item) => `${process.env.HOST}/images/${item.image}`
                            ),
                          });
                        } else {
                          newResult.push({ ...result[i].dataValues });
                        }
                      });
                  }
                  formatResult(res, 200, true, "Success Get Detail Product", {
                    detailsProduct: {
                      name: resultProduct.name,
                      sellerName: resultSeller.name,
                      sellerId: resultSeller.userId,
                      image: resultPic.map((item) => item.image),
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
                    recommendationProduct: newResult,
                  });
                }
              );
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

exports.getProductByCategory = (req, res) => {
  Product.findAll({ where: { category: req.query.category }, limit: 10 }).then(async (result) => {
    const newResult = [];
    for (let i in result) {
      const resultSeller = await User.findOne({ where: { userId: result[i].seller } });
      await picProduct.findAll({ where: { productId: result[i].id } }).then((resultPic) => {
        if (resultPic) {
          newResult.push({
            ...result[i].dataValues,
            sellerName: resultSeller.nameStore,
            image: resultPic.map((item) => `${process.env.HOST}/images/${item.image}`),
          });
        } else {
          newResult.push({ ...result[i].dataValues, sellerName: resultSeller.nameStore });
        }
      });
    }
    formatResult(res, 200, true, "Success Get Product By Category", newResult);
  });
};
