import { NextFunction, Response } from 'express';
import db from '../database/knex';
import HttpStatus from '../utils/http-status';
import { ResourceRequest } from '../utils/types';

export default async function checkRecord(req: ResourceRequest, res: Response, next: NextFunction) {
  const { resource: tableName, id } = req.params;
  
  if (!id) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'No id provided' });
    return;
  }
  
  const result = await db(tableName)
    .where({ id })
    .count('id')
    .first();
  
  const count = +(result?.count ?? 0);
  if (count > 0) {
    next();
  } else {
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: `Resource "${tableName}" with ID=${id} doesn't exist` });
  }
}
