const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
	config.DB,
	config.USER,
	config.PASSWORD,
	{
		host: config.HOST,
		dialect: config.dialect,
		pool: {
			max: config.pool.max,
			min: config.pool.min,
			acquire: config.pool.acquire,
			idle: config.pool.idle
		},
		logging: true
	}
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.country = require("./country.model.js")(sequelize, Sequelize);
db.region = require("./region.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  	through: "user_roles"
});
db.user.belongsToMany(db.role, {
  	through: "user_roles"
});

//addresse a une colonne userId
db.user.hasOne(db.address);
db.address.belongsTo(db.user);

db.country.hasMany(db.region);
db.region.belongsTo(db.country);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;