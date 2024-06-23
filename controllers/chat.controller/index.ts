import { Request, Response, NextFunction } from "express";

export const getActiveUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send({ status: true, data: [] });
  } catch (err: any) {
    next(err);
  }
};
