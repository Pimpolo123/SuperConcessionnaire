module.exports = (sequelize, Sequelize) => {
    const Availability = sequelize.define("availability", {
        openingDays: {
            type: Sequelize.STRING,
            allowNull: false
        },
        openingTime: {
            type: Sequelize.TIME,
            allowNull: false
        },
        closingTime: {
            type: Sequelize.TIME,
            allowNull: false
        },
        availableHours: {
            type: Sequelize.STRING,
            allowNull: false
        },
        day: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        week: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        month: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
);
  
    return Availability;
};