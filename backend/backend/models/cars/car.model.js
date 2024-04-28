module.exports = (sequelize, Sequelize) => {
    const Car = sequelize.define("cars", {
        power: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		year: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		price: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		kilometers: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		firstReg: {
			type: Sequelize.DATEONLY,
			allowNull: true,
		},
        displacement: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
        gears: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		cylinders: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		doors: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		co2: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		urbanCons: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
		mixCons: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
		hwCons: {
			type: Sequelize.FLOAT,
			allowNull: true,
		}
    });

    return Car;
};