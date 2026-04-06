import { NextFunction, Response } from 'express';
import db from '../database/knex';
import HttpStatus from '../utils/http-status';
import { ResourceRequest } from '../utils/types';

export default async function validateResource(req: ResourceRequest, res: Response, next: NextFunction) {
  const { resource: tableName } = req.params;
  
  const result = await db('information_schema.tables')
    .where({
      table_schema: 'public',
      table_name: tableName,
    })
    .count('table_name')
    .first();
  
  const count = +(result?.count ?? 0);
  if (count > 0) {
    next();
  } else {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: `Resource "${tableName}" doesn't exist` });
  }
}
