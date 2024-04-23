module.exports = (sequelize, Sequelize) => {
    const Car = sequelize.define("cars", {
		make: {
			type: Sequelize.STRING,
			allowNull: false,
		},
        model: {
			type: Sequelize.STRING,
			allowNull: false,
		},
        power: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
        displacement: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
        category: {
			type: Sequelize.STRING,
			allowNull: true,
		},
        gearboxtype: {
			type: Sequelize.STRING,
			allowNull: true,
		},
        gears: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
        drivetrain: {
			type: Sequelize.STRING,
			allowNull: true,
		},
        fueltype: {
			type: Sequelize.STRING,
			allowNull: true,
		},
    });
  
    return Car;
};