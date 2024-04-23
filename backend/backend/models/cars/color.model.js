module.exports = (sequelize, Sequelize) => {
    const Color = sequelize.define("color", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Color;
};