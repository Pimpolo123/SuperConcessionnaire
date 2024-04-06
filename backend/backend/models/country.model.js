module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("countries", {
        countryName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        countryShortCode: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        paranoid: false,
        updatedAt: false,
        createdAt: false
    }
    );
    return Country;
  };