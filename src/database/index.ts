import { Sequelize } from 'sequelize';
import { SkillsFactory } from './models/skills';
import { UserFactory } from './models/user';

export const dbConfig = new Sequelize('postgres://abd:123@localhost:5432/chirpyest');

// THIS ONES ARE THE ONES YOU NEED TO USE ON YOUR CONTROLLERS
export const User = UserFactory(dbConfig);
export const Skills = SkillsFactory(dbConfig);
