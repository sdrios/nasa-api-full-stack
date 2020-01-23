'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorites = sequelize.define('favorites', {
    imageDate: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  favorites.associate = function(models) {
    // associations can be defined here
     favorites.belongsTo(models.user,{
      as:'user',
      foreignKey: 'id'
    })
  };
  return favorites;
};