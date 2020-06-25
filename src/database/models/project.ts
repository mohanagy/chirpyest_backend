import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

class Project extends Model {
  public id!: number;

  public ownerId!: number;

  public name!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'projects',
  },
);

export default Project;
