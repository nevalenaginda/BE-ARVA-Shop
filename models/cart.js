module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("cart", {
    userId: {
      type: Sequelize.STRING,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
  });

  return Cart;
};
