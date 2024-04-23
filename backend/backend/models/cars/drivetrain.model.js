module.exports = (sequelize, Sequelize) => {
    const Drivetrain = sequelize.define("drivetrain", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return Drivetrain;
};