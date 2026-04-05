import { NextFunction } from 'express';
import db from '../database/knex';
import HttpStatus from '../utils/http-status';
import { ResourceRequest, ResourceResponse } from '../utils/types';

export default async function sorting(req: ResourceRequest, res: ResourceResponse, next: NextFunction) {
  const { resource: tableName } = req.params;
  const { _sort = 'id', _order } = req.query;
  
  const order = _order ?? (_sort.startsWith('-') ? 'desc' : 'asc');
  const column = _sort.startsWith('-') ? _sort.substring(1) : _sort;
  
  const result = await db('information_schema.columns')
    .where({
      table_schema: 'public',
      table_name: tableName,
      column_name: column,
    })
    .count('column_name')
    .first();
  
  const count = +(result?.count ?? 0);
  if (count <= 0) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: `Field "${column}" doesn't exist for resource "${tableName}"` });
    return;
  }
  
  res.locals.sorting = {
    field: column,
    order,
  };
  next();
}
