module.exports = (sequelize, Sequelize) => {
    const Favorite = sequelize.define("favorites", {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        carId: {
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
    return Favorite;
  };