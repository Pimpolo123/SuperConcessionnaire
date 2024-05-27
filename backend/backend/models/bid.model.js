module.exports = (sequelize, Sequelize) => {
    const Bid = sequelize.define("bid", {
        bidStartDate: {
            type: Sequelize.DATE,
            allowNull: false,
            unique: false
        },
        bidEndDate: {
            type: Sequelize.DATE,
            allowNull: true,
            unique: false
        },
        minimumBid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            unique: false
        },
        startingPrice: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        currentPrice: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: false
        },
        carId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
    );
    return Bid;
  };