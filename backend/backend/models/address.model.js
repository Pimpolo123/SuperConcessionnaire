module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define("addresses", {
		country: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		region: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		city: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		postcode: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		street: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		housenumber: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		boxnumber: {
			type: Sequelize.INTEGER,
			allowNull: true,
		}
    }
  );
  
    return Address;
  };