module.exports = (sequelize, Sequelize) => {
    const Option = sequelize.define("option", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Option;
};