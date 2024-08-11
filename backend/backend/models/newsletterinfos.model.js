module.exports = (sequelize, Sequelize) => {
    const NewsletterInfos = sequelize.define("newsletterinfos", {
        isOn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            unique: false
        },
        frequency: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: false
        },
        time: {
            type: Sequelize.TIME,
            allowNull: true,
            unique: false
        },
        dayOfMonth: {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: false
        },
        dayOfWeek: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: false
        },
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
    );
    return NewsletterInfos;
  };