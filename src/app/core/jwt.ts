import debug from 'debug';
import jwt from 'jsonwebtoken';
import { CONSTANTS } from './env';
import { IUser } from '../components/user/user.model';
import { TObject, TNullable } from '../types';

const logger = debug('app:src/app/core/jwt.ts');

export const createAuthToken = (user: IUser, expiresIn?: string): string => {
  const authToken = jwt.sign({ _id: user._id }, CONSTANTS.AUTH_SECRET_TOKEN, {
    expiresIn: expiresIn || '2192h', // expires in 3 months
    issuer: 'express-ts-boilerplate-2022',
  });

  return authToken;
};

export const createToken = (data: TObject, expiresIn?: string): string => {
  const token = jwt.sign(data, CONSTANTS.AUTH_SECRET_TOKEN, {
    expiresIn: expiresIn || '2192h', // expires in 3 months
    issuer: 'express-ts-boilerplate-2022',
  });

  return token;
};

export const checkTokenIsExpired = (
  decodedToken: TNullable<jwt.JwtPayload> | undefined,
  userLastLogoutAt?: TNullable<number>
): boolean => {
  if (!decodedToken) return true;
  const now = Math.floor(Date.now() / 1000);
  if (decodedToken?.exp && now > decodedToken.exp) return true;
  if (!userLastLogoutAt) return false;
  if (decodedToken?.iat && userLastLogoutAt > decodedToken.iat) return true;
  return false;
};

export const decodeToken = (token: string) => {
  try {
    const decodedToken = jwt.decode(token, { json: true });
    return decodedToken;
  } catch (err) {
    if (err instanceof Error) {
      logger('decodeToken:: error: ', err.message);
      throw new Error(err.message);
    }
  }
};

export const verifyToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, CONSTANTS.AUTH_SECRET_TOKEN);
    return decodedToken;
  } catch (err) {
    if (err instanceof Error) {
      logger('verifyToken:: error: ', err.message);
      throw new Error(err.message);
    }
  }
};
