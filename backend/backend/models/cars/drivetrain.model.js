module.exports = (sequelize, Sequelize) => {
    const Drivetrain = sequelize.define("drivetrain", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return Drivetrain;
};