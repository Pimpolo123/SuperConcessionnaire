module.exports = (sequelize, Sequelize) => {
    const Car = sequelize.define("cars", {
        power: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
        displacement: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
        gears: {
			type: Sequelize.INTEGER,
			allowNull: true,
		}
    });

    return Car;
};