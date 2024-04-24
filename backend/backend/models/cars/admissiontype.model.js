module.exports = (sequelize, Sequelize) => {
    const AdmissionType = sequelize.define("admissiontype", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return AdmissionType;
};