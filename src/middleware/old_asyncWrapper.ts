import type { Request, Response, NextFunction } from 'express';

export type AsyncHandler<
  P = any, // Params
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<any>;

const asyncWrapper = <
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: AsyncHandler<P, ResBody, ReqBody, ReqQuery>
) => (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncWrapper;