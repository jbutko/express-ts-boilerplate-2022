import debug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { User } from '../../user/user.model';
import { decodeToken, checkTokenIsExpired } from '../../../core';

const logger = debug('app:src/app/components/auth/local/auth.middleware.ts');

/**
 * Check if user is authenticated middleware
 */
export const middlewareAuthenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentToken = req.headers['authorization'] as string;
    if (!sentToken) {
      next({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
      return;
    }

    const decodedToken = decodeToken(sentToken);
    const user = await User.findOne({ _id: decodedToken?._id });
    if (!user) {
      next({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
      return;
    }

    const isTokenExpired = checkTokenIsExpired(
      decodedToken,
      user.lastLogoutAt ? new Date(user.lastLogoutAt).getTime() : null
    );
    if (isTokenExpired) {
      next({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    logger('middlewareIsAuthenticated:: error: ', err);
    next(err);
  }
};
