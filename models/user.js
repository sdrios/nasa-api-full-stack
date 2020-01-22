"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      username: DataTypes.STRING,
      password: DataTypes.TEXT,
      g_id: DataTypes.STRING,
      g_name: DataTypes.STRING
    },
    {}
  );
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
