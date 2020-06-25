import { DataTypes, Sequelize } from 'sequelize';
import { SkillsStatic } from '../../types/rest-api/index';

export function SkillsFactory(sequelize: Sequelize): SkillsStatic {
  return <SkillsStatic>sequelize.define('skills', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    skill: {
      type: DataTypes.STRING,
      allowNull: false,
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
  });
}
