module.exports = (sequelize, Sequelize) => {
    const CarPicture = sequelize.define("carpictures", {
      base64url: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    },
    {
      createdAt: false,
      updatedAt: false
    });
  
    return CarPicture;
};