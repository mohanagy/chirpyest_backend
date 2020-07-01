import { DataTypes, Sequelize } from 'sequelize';
import { UserTypes } from '../../helpers/constants';
import { UserStatic } from '../../types/sequelize';

export function UserFactory(sequelize: Sequelize): UserStatic {
  return sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(UserTypes)),
      allowNull: false,
    },
    cognitoId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }) as UserStatic;
}
