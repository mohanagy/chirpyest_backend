import { DataTypes, Sequelize } from 'sequelize';
import { NewsletterStatic } from '../../types/sequelize';

export function NewsletterFactory(sequelize: Sequelize): NewsletterStatic {
  return sequelize.define('Newsletter', {
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }) as NewsletterStatic;
}
