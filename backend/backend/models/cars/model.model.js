module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("model", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Model;
};