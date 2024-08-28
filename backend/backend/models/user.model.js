module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        surname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birthdate: {
            type: Sequelize.DATEONLY
        },
        phonenumber: {
            type: Sequelize.STRING
        },
        banned: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        emailoptin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        emailPriceChange: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        emailCarSold: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        emailBidWon: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },{paranoid: true}
  );
  
    return User;
  };