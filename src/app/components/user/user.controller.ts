import debug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from './user.model';
import { sanitizeUser } from './user.helpers';
import { createAuthToken } from '../../core/jwt';

const logger = debug('app:src/app/components/user/user.controller.ts');

/**
 * Create user
 * POST /users
 * return:
 * "user": {
        "email": "john@doe.com",
        "password": "Password123!",
        "gdprConfirmed": true,
        "createdAt": "2021-09-24T21:21:04.069Z",
        "lastLoginAt": null,
        "lastLogoutAt": null,
        "confirmed": false,
        "confirmedAt": null,
        "_id": "614e418be6cbbaaf27a960ce",
        "__v": 0
    },
    "token": "..."
 */
export const endpointPostUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body;
    const newUser = await User.create(user);
    await User.update({ _id: newUser._id }, { lastLogin: new Date(), lastLogout: null });

    return res.status(StatusCodes.OK).json({
      user: sanitizeUser(newUser.toObject()),
      token: createAuthToken(user),
    });
  } catch (err) {
    logger('endpointPostUser:: error: ', err);
    next(err);
  }
};

/**
 * Forgot password
 * POST /users/forgot-password
 */
export const endpointPostForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.forgotPassword(req.body?.email);
    res.status(StatusCodes.OK);
  } catch (err) {
    logger('endpointPostForgotPassword:: error: ', err);
    next(err);
  }
};

/**
 * Reset password
 * POST /users/reset-password
 */
export const endpointPostResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, passwordResetToken } = req.body;

  try {
    await User.resetPassword(newPassword, passwordResetToken);
    res.status(StatusCodes.OK);
  } catch (err) {
    logger('endpointPostResetPassword:: error: ', err);
    next(err);
  }
};
