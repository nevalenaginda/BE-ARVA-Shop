const dbConfig = require("../configs");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.product = require("./product")(sequelize, Sequelize);
db.picProduct = require("./pictureProduct")(sequelize, Sequelize);
db.address = require("./addressUser")(sequelize, Sequelize);
db.ordered = require("./orderedProduct")(sequelize, Sequelize);
db.cart = require("./cart")(sequelize, Sequelize);
db.messages = require("./messages")(sequelize, Sequelize);

module.exports = db;
