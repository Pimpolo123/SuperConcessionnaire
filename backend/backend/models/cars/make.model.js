module.exports = (sequelize, Sequelize) => {
    const Make = sequelize.define("make", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Make;
};