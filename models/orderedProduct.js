module.exports = (sequelize, Sequelize) => {
  const OrderedProduct = sequelize.define("ordered_product", {
    productId: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["cancelled", "pending", "process", "sending", "completed"],
      defaultValue: "pending",
    },
    totalPayment: {
      type: Sequelize.INTEGER,
    },
    deliveryCost: {
      type: Sequelize.INTEGER,
    },
    methodPayment: {
      type: Sequelize.ENUM,
      values: ["gopay", "pos", "mastercard"],
    },
  });

  return OrderedProduct;
};
