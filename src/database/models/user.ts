const users = (sequelize: any, DataTypes: any): any => {
  const Users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
    },
    cognitoId: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    activated: {
      type: DataTypes.BOOLEAN,
    },
  });

  Users.hasMany(Users, { foreignKey: 'created_by' });
  Users.hasMany(Users, { foreignKey: 'updated_by' });

  return Users;
};

export default users;
