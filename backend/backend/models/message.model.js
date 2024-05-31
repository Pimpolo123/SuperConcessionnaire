module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
      toRoleId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      toUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      responseTo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isOk: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    },
    {
        paranoid: false,
        updatedAt: true,
        createdAt: true
    }
);
  
    return Message;
};