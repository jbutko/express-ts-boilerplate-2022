import debug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { User } from '../../user/user.model';
import { createAuthToken, decodeToken } from '../../../core';
import { comparePasswords, sanitizeUser } from '../../user/user.helpers';
import { trim } from 'lodash';

const logger = debug('app:src/app/components/auth/local/auth.controller.ts');

/**
 * Authenticate user by email/password
 */

/**
 * User sign-in by email/password
 * POST /auth/sign-in
 */
export const endpointPostSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const correctPassword = await comparePasswords(trim(password), trim(user.password));
    if (!correctPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const lastLoginAt = new Date();
    const token = createAuthToken(user);
    await User.updateOne({ _id: user._id }, { lastLoginAt, lastLogoutAt: null });
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    logger('endpointPostSignIn:: error :: ', err);
    next(err);
  }
};

/**
 * User sign out
 * POST /auth/sign-out
 */
export const endpointPostSignOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sentToken = req.headers['authorization'] || req.body.token;
    const decodedToken = decodeToken(sentToken);
    const user = await User.findOne({
      _id: String(decodedToken?._id),
    });
    if (!user) throw new Error('Sign out error: user not found');

    const logoutTime = new Date();
    if (!user.lastLogoutAt)
      await User.updateOne(
        { _id: decodedToken?._id },
        { lastLoginAt: null, lastLogoutAt: logoutTime }
      );

    res.status(200).json({
      lastLogoutAt: !user.lastLogoutAt ? logoutTime : user.lastLogoutAt,
    });
  } catch (err) {
    logger('endpointPostSignOut:: error: ', err);
    next(err);
  }
};
