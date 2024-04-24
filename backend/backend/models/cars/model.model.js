module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("model", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Model;
};