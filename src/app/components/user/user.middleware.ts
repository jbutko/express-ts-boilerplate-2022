import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { User } from './user.model';
import { decodeToken, checkTokenIsExpired } from '../../core';

export const checkUserExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userBody = req.body;
    const user = await User.findOne({ email: userBody?.email });

    if (user) {
      next({
        message: 'User with same email already exists',
        code: 'userExistsError',
        status: StatusCodes.BAD_REQUEST,
      });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const checkUserFoundMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userBody = req.body;
    const user = await User.findOne({ email: userBody?.email });

    if (!user) {
      next({
        message: ReasonPhrases.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND,
        code: 'userNotFoundError',
      });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const checkResetTokenExpiredMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { passwordResetToken } = req.body;
    const decodedToken = decodeToken(passwordResetToken);
    const isTokenExpired = decodedToken ? checkTokenIsExpired(decodedToken) : true;

    if (isTokenExpired) {
      next({
        message: 'Password reset token expired',
        code: 'resetTokenExpired',
        status: StatusCodes.BAD_REQUEST,
      });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};
