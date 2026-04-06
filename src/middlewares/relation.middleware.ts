import { NextFunction } from 'express';
import { checkField, checkResource } from '../utils/helpers';
import { ResourceRequest, ResourceResponse } from '../utils/types';

// Only support foreign keys with format `<table_singular>_id`. e.g. `user_id` for `users`
export default async function relation(req: ResourceRequest, res: ResourceResponse, next: NextFunction) {
  const { resource: tableName } = req.params;
  const { _expand, _embed } = req.query;
  
  // parse & validate table names & fk
  // get fk: `<table_singular>_id`
  // pass to handler
  // query extra data from respective parent & child table
  
  if (_expand && await checkResource(_expand)) {
    const singular = _expand.endsWith('s') ? _expand.substring(0, _expand.length - 1) : _expand;
    const fk = singular + '_id';
    
    if (await checkField(tableName, fk)) {
      res.locals.relation = {
        ...res.locals.relation,
        expand: {
          table: _expand,
          prop: singular,
          foreignKey: fk,
        },
      };
    }
  }
  
  if (_embed && await checkResource(_embed)) {
    const singular = tableName.endsWith('s') ? tableName.substring(0, tableName.length - 1) : tableName;
    const fk = singular + '_id';
    
    if (await checkField(_embed, fk)) {
      res.locals.relation = {
        ...res.locals.relation,
        embed: {
          table: _embed,
          foreignKey: fk,
        },
      };
    }
  }
  
  next();
}
