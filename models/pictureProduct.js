module.exports = (sequelize, Sequelize) => {
  const ProductImage = sequelize.define("product_image", {
    productId: {
      type: Sequelize.INTEGER,
    },
    image: {
      type: Sequelize.STRING,
    },
  });

  return ProductImage;
};
