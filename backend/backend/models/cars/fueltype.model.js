module.exports = (sequelize, Sequelize) => {
    const FuelType = sequelize.define("fueltype", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return FuelType;
};