module.exports = (sequelize, Sequelize) => {
    const Make = sequelize.define("make", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Make;
};