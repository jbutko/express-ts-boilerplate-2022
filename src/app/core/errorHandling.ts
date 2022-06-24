import debug from 'debug';
import { Request, Response } from 'express';

const logger = debug('app:src/app/core/errorHandling.ts');

export interface IErrorResponse {
  status: number;
  message: string;
  detail: string;
  url?: string;
  stack?: string;
  type?: string;
  code?: string;
}

export class ErrorHandling {
  public static routeNotFound(req: Request, res: Response): Response {
    return res.status(404).json({
      status: 404,
      message: 'Route not found',
      url: req.url,
    });
  }

  public static dev(err: any, req: Request, res: Response): Response {
    const host = req.get('host');
    const url = req.protocol + '://' + host + req.url;
    const status = err.status || 500;
    const errMsg = {
      status: !err.status && err.message ? 400 : status,
      stack: err.stack,
      code: err.code || (err.err && err.err.errorIdentifier),
      message: err.message || err.err.message,
      type: err.type,
      url,
    };

    logger(`dev:: err: `, err);
    return res.status(errMsg.status).json(errMsg);
  }

  public static prod(err: any, req: Request, res: Response): Response {
    const status = err.status || 500;
    const errMsg = {
      status: !err.status && err.message ? 400 : status,
      code: err.code || (err.err && err.err.errorIdentifier),
      message: err.message || err.err.message,
      type: err.type,
    };

    return res.status(errMsg.status).json(errMsg);
  }

  public static handleValidatorErrors(err: any, req: Request, res: Response): Response {
    const errMsg: IErrorResponse = {
      status: 400,
      type: err.type,
      message: `${err.type} params validation error`,
      detail: err.error && err.error.details,
    };
    logger('errMsg', errMsg);
    if (err && err.code) errMsg.code = err.code;
    return res.status(errMsg.status).json(errMsg);
  }
}
