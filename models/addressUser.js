module.exports = (sequelize, Sequelize) => {
  const AddressUser = sequelize.define("address_user", {
    saveAs: {
      type: Sequelize.STRING(15),
    },
    userId: {
      type: Sequelize.STRING,
    },
    recipientName: {
      type: Sequelize.STRING(20),
    },
    recipientPhone: {
      type: Sequelize.STRING(13),
    },
    postalCode: {
      type: Sequelize.STRING(8),
    },
    city: {
      type: Sequelize.STRING(15),
    },
    address: {
      type: Sequelize.STRING(150),
    },
    isPrimary: {
      type: Sequelize.BOOLEAN,
    },
  });

  return AddressUser;
};
