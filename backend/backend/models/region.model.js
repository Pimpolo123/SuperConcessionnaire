module.exports = (sequelize, Sequelize) => {
    const Region = sequelize.define("regions", {
        regionName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        regionShortCode: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: false
        },
    },
        {
            paranoid: false,
            updatedAt: false,
            createdAt: false
        }
    );
    return Region;
  };