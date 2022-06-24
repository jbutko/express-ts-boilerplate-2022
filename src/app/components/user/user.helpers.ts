import debug from 'debug';
import { genSalt, hash, compare } from 'bcryptjs';
import { IUser } from './user.model';
import { pick } from 'lodash';
import { TNullable } from '../../types';

const logger = debug('app:src/app/components/user/user.helpers.ts');

export const hashPassword = async (password: string): Promise<TNullable<string>> => {
  try {
    const SALT_WORK_FACTOR = 10;
    const salt = await genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (err) {
    logger('hashPassword:: error: ', err);
    return null;
  }
};

export const comparePasswords = async (pass: string, dbPass: string): Promise<boolean> => {
  if (!pass || !dbPass) return false;
  try {
    return await compare(pass, dbPass);
  } catch (err) {
    logger('comparePasswords:: err: ', err);
    return false;
  }
};

export const sanitizeUser = (
  user: IUser,
  props = ['_id', 'email', 'createdAt']
): TNullable<Partial<IUser>> => {
  if (!user) return null;
  const sanitized = pick(user, props);
  return sanitized;
};
