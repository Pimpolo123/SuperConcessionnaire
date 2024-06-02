module.exports = (sequelize, Sequelize) => {
    const DealerInformations = sequelize.define("dealerinformations", {
        dealershipName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        bankAccount: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        region: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        postcode: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        phoneNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
    );
    return DealerInformations;
  };