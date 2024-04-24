module.exports = (sequelize, Sequelize) => {
    const Color = sequelize.define("color", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Color;
};