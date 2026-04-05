import db from '../database/knex';
import HttpStatus from '../utils/http-status';
import { ResourceRequest, ResourceResponse } from '../utils/types';

export default class ResourceController {
  static async getAll(req: ResourceRequest, res: ResourceResponse) {
    const { resource: tableName } = req.params;
    const { columns: selects, sorting, pagination } = res.locals;
    
    const query = db(tableName)
      .select(...selects)
      .orderBy(sorting.field, sorting.order)
      .offset(pagination.offset)
      .limit(pagination.limit);
    
    const result = await query;
    
    res.setHeader('X-Total-Count', result.length);
    res.status(HttpStatus.OK).json(result);
  }
  
  static async getOne(req: ResourceRequest, res: ResourceResponse) {
    res.status(HttpStatus.OK).json({ params: req.params, query: req.query });
  }
  
  static async postOne(req: ResourceRequest, res: ResourceResponse) {
    res.status(HttpStatus.CREATED).json({ params: req.params, body: req.body });
  }
  
  static async putOne(req: ResourceRequest, res: ResourceResponse) {
    res.status(HttpStatus.OK).json({ params: req.params, body: req.body });
  }
  
  static async patchOne(req: ResourceRequest, res: ResourceResponse) {
    res.status(HttpStatus.OK).json({ params: req.params, body: req.body });
  }
  
  static async deleteOne(req: ResourceRequest, res: ResourceResponse) {
    res.status(HttpStatus.OK).json({ params: req.params });
  }
}
