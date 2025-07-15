// import { Request, Response, NextFunction } from 'express';

// export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Server Error'
//   });
// };



import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
