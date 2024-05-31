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
db.option = require("./cars/option.model")(sequelize, Sequelize);
db.euro = require("./cars/euro.model")(sequelize, Sequelize);
db.carpicture = require("./cars/carpicture.model")(sequelize, Sequelize);
db.favorite = require("./favorite.model")(sequelize, Sequelize);
db.bid = require("./bid.model")(sequelize, Sequelize);
db.message = require("./message.model")(sequelize, Sequelize);

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

db.make.hasOne(db.model);
db.model.belongsTo(db.make);

db.make.hasOne(db.car);
db.car.belongsTo(db.make);

db.model.hasOne(db.car);
db.car.belongsTo(db.model);

db.admissiontype.hasOne(db.car);
db.car.belongsTo(db.admissiontype);

db.category.hasOne(db.car);
db.car.belongsTo(db.category);

db.color.hasOne(db.car);
db.car.belongsTo(db.color);

db.gearboxtype.hasOne(db.car);
db.car.belongsTo(db.gearboxtype);

db.fueltype.hasOne(db.car);
db.car.belongsTo(db.fueltype);

db.drivetrain.hasOne(db.car);
db.car.belongsTo(db.drivetrain);

db.euro.hasOne(db.car);
db.car.belongsTo(db.euro);

db.option.belongsToMany(db.car, {
	through: "car_options"
});
db.car.belongsToMany(db.option, {
	through: "car_options"
});

db.car.hasMany(db.carpicture);
db.carpicture.belongsTo(db.car);

db.user.hasMany(db.message);
db.message.belongsTo(db.user);

db.car.hasMany(db.message);
db.message.belongsTo(db.car);


db.ROLES = [
	{name:"user", id:1},
	{name:"moderator", id:2},
	{name:"admin", id:3},
];

module.exports = db;