module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointment", {
        day: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
);
  
    return Appointment;
};