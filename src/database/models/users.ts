import { DataTypes, Sequelize } from 'sequelize';
import { UserTypes } from '../../interfaces';
import { UserStatic } from '../../types/sequelize';

export function UserFactory(sequelize: Sequelize): UserStatic {
  return sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
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
    newsletterSubscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    termsCondsAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    paypalAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
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
