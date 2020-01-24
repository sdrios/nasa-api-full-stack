'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imageDate: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER
      },
      imageURL: {
        type: Sequelize.STRING
      },
      imageTitle: {
        type: Sequelize.STRING
      },
      imageCopyright: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function(){
      queryInterface.addConstraint('favorites',['userID'],{
        type: 'FOREIGN KEY',
        name: 'user_favorites_fk',
        references: {
          table: 'users',
          field:'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('favorites');
  }
};