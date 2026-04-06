import { NextFunction, Response } from 'express';
import { checkResource } from '../utils/helpers';
import HttpStatus from '../utils/http-status';
import { ResourceRequest } from '../utils/types';

export default async function validateResource(req: ResourceRequest, res: Response, next: NextFunction) {
  const { resource: tableName } = req.params;
  if (await checkResource(tableName)) {
    next();
  } else {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: `Resource "${tableName}" doesn't exist` });
  }
}
