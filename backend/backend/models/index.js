const config = require("../config/db.config.js");
require("dotenv").config();

console.log('CONFIG', config);

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
db.car = require("./cars/car.model")(sequelize, Sequelize);
db.make = require("./cars/make.model")(sequelize, Sequelize);
db.model = require("./cars/model.model")(sequelize, Sequelize);
db.admissiontype = require("./cars/admissiontype.model")(sequelize, Sequelize);
db.category = require("./cars/category.model")(sequelize, Sequelize);
db.color = require("./cars/color.model")(sequelize, Sequelize);
db.drivetrain = require("./cars/drivetrain.model")(sequelize, Sequelize);
db.fueltype = require("./cars/fueltype.model")(sequelize, Sequelize);
db.gearboxtype = require("./cars/gearboxtype.model")(sequelize, Sequelize);

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

db.car.hasOne(db.make);
db.make.belongsTo(db.car);

db.car.hasOne(db.model);
db.model.belongsTo(db.car);


db.car.hasOne(db.admissiontype);
db.admissiontype.belongsTo(db.car);

db.car.hasOne(db.category);
db.category.belongsTo(db.car);


db.car.hasOne(db.color);
db.color.belongsTo(db.car);

db.car.hasOne(db.gearboxtype);
db.gearboxtype.belongsTo(db.car);

db.car.hasOne(db.fueltype);
db.fueltype.belongsTo(db.car);

db.car.hasOne(db.drivetrain);
db.drivetrain.belongsTo(db.car);


db.ROLES = [
	{name:"user", id:1},
	{name:"moderator", id:2},
	{name:"admin", id:3},
];

module.exports = db;