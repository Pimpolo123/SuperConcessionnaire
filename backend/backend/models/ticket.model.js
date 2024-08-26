module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("ticket", {
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        responseTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        adminResponded: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
    },
    {
        paranoid: true,
        updatedAt: true,
        createdAt: true
    }
);
  
    return Ticket;
};