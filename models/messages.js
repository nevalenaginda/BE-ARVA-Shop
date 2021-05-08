module.exports = (sequelize, Sequelize) => {
  const Messages = sequelize.define("message", {
    to: {
      type: Sequelize.STRING,
    },
    from: {
      type: Sequelize.STRING,
    },
    messageBody: {
      type: Sequelize.STRING,
    },
  });

  return Messages;
};
