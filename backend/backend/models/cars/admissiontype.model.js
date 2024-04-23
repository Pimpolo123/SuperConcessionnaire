module.exports = (sequelize, Sequelize) => {
    const AdmissionType = sequelize.define("admissiontype", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return AdmissionType;
};