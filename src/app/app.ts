import bodyParser from 'body-parser';
import compression from 'compression';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';
import { getRouter } from './app.routes';
import { ErrorHandling } from './core';
import { ExpressJoiError } from 'express-joi-validation';

const logger = debug('app:src/app/app.ts');

export class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRouter();
    this.initErrorHandling();
  }

  // app router
  private initRouter() {
    this.app.use('/api/v1/', getRouter());
  }

  // middlewares
  private initMiddlewares() {
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private initErrorHandling() {
    // catch 404
    this.app.use((req: Request, res: Response) => {
      logger({
        status: 404,
        title: 'Not Found',
        message: 'Route not found',
        url: req.url,
      });
      ErrorHandling.routeNotFound(req, res);
    });

    // catch all error handling
    this.app.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
      const isDev = this.app.get('env') === 'development';
      const isJoiValidationErr = err?.error?.isJoi;

      // param validation error
      if (isJoiValidationErr) return ErrorHandling.handleValidatorErrors(err, req, res);

      // development error handling (more info)
      if (isDev) return ErrorHandling.dev(err, req, res);

      // prod error handling
      ErrorHandling.prod(err, req, res);
      next();
    });
  }
}
