'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('favorites',
      'imageURL', Sequelize.STRING
    ).then(() => {
      queryInterface.addColumn('favorites',
        'imageTitle', Sequelize.STRING
    )}).then(() => {
          queryInterface.addColumn('favorites',
            'imageCopyright', Sequelize.STRING
    )})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('favorites',
      'imageURL', Sequelize.STRING
    ).then(() => {
      queryInterface.addColumn('favorites',
        'imageTitle', Sequelize.STRING
    )}).then(() => {
          queryInterface.addColumn('favorites',
            'imageCopyright', Sequelize.STRING
    )})
  } 
};
