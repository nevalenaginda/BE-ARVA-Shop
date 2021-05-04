module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    userId: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING(64),
      defaultValue: "Anon",
    },
    email: {
      type: Sequelize.STRING(64),
    },
    password: {
      type: Sequelize.STRING(64),
    },
    role: {
      type: Sequelize.ENUM,
      values: ["seller", "user"],
      defaultValue: "user",
    },
    phone: {
      type: Sequelize.STRING(14),
    },
    gender: {
      type: Sequelize.ENUM,
      values: ["female", "male"],
      defaultValue: "male",
    },
    birthday: {
      type: Sequelize.DATEONLY,
    },
    city: {
      type: Sequelize.STRING(15),
    },
    avatar: {
      type: Sequelize.STRING,
      defaultValue: "https://www.jewishinteractive.org/wp-content/uploads/2016/03/person.png",
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return User;
};
