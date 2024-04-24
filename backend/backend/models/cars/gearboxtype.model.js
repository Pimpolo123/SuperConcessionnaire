module.exports = (sequelize, Sequelize) => {
    const GearboxType = sequelize.define("gearboxtype", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return GearboxType;
};