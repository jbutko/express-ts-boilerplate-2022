import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
import { endpointPostSignIn, endpointPostSignOut } from '../components/auth';
import { PostSignInSchema, HeaderPostLogoutSchema } from '../components/auth';

/**
 * Auth router
 * url: /api/v1/auth
 */
export const authRouter = () => {
  const router = Router();
  const validator = createValidator({ passError: true });

  router
    // sign in user
    .post('/sign-in', validator.body(PostSignInSchema), endpointPostSignIn)
    // sign out user
    .post('/sign-out', validator.headers(HeaderPostLogoutSchema), endpointPostSignOut);

  return router;
};
