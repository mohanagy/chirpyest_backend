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
    cognito_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    newsletter_subscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    terms_conds_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    paypal_account: {
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
