module.exports = (sequelize, Sequelize) => {
    const GearboxType = sequelize.define("gearboxtype", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return GearboxType;
};