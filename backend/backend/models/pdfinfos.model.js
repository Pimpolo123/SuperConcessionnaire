module.exports = (sequelize, Sequelize) => {
    const pdfInfos = sequelize.define("pdfinfos", {
        fileName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        dealershipName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        promiseDate: {
            type: Sequelize.DATE,
            allowNull: false,
            unique: false
        },
        promiseLocation: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
        deposit: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false
        },
        bankAccount: {
            type: Sequelize.STRING,
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
    return pdfInfos;
  };