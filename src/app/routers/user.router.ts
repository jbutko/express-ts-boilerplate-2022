import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

// endpoint handlers
import {
  endpointPostUser,
  endpointPostForgotPassword,
  endpointPostResetPassword,
} from '../components/user/user.controller';

// validators and middlewares
import {
  PostUserSchema,
  PostForgotPasswordSchema,
  PostResetPasswordSchema,
  checkUserExistsMiddleware,
  checkResetTokenExpiredMiddleware,
  checkUserFoundMiddleware,
} from '../components/user';

/**
 * User router
 * url: /api/v1/users
 */
export const userRouter = () => {
  const router = Router();
  const validator = createValidator({ passError: true });

  router
    // create user
    .post('/', validator.body(PostUserSchema), checkUserExistsMiddleware, endpointPostUser)
    // request new password change
    .post(
      '/forgot-password',
      validator.body(PostForgotPasswordSchema),
      checkUserFoundMiddleware,
      endpointPostForgotPassword
    )
    // set new password
    .post(
      '/reset-password',
      validator.body(PostResetPasswordSchema),
      checkResetTokenExpiredMiddleware,
      endpointPostResetPassword
    );

  return router;
};
