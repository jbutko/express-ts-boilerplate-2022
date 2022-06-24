import { Router } from 'express';
import * as routers from './routers';

export const getRouter = () => {
  const router = Router();
  router.use('/auth', routers.authRouter()); // /api/v1/auth
  router.use('/users', routers.userRouter()); // /api/v1/users
  return router;
};
