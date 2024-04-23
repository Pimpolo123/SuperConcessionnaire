module.exports = (sequelize, Sequelize) => {
    const FuelType = sequelize.define("fueltype", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return FuelType;
};