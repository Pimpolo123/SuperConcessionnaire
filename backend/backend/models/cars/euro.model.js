module.exports = (sequelize, Sequelize) => {
    const Euro = sequelize.define("euro", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Euro;
};