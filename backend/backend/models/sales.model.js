module.exports = (sequelize, Sequelize) => {
    const sales = sequelize.define("sales", {
    },
    {
        paranoid: true,
        updatedAt: false,
        createdAt: true
    }
    );
    return sales;
  };