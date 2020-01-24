'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorites = sequelize.define('favorites', {
    imageDate: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    imageURL:DataTypes.STRING,
    imageTitle:DataTypes.STRING,
    imageCopyright:DataTypes.STRING
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