module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    name: {
      type: Sequelize.STRING(64),
    },
    description: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    color: {
      type: Sequelize.JSON,
    },
    size: {
      type: Sequelize.JSON,
    },
    stock: {
      type: Sequelize.INTEGER,
    },
    condition: {
      type: Sequelize.ENUM,
      values: ["new", "old"],
      defaultValue: "new",
    },
    category: {
      type: Sequelize.STRING(15),
    },
    seller: {
      type: Sequelize.STRING,
    },
    brand: {
      type: Sequelize.STRING(20),
    },
    status: {
      type: Sequelize.ENUM,
      values: ["ready", "sold out", "archived"],
      defaultValue: "ready",
    },
  });

  return Product;
};
