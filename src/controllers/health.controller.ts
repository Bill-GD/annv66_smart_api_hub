import type { Request, Response } from 'express';
import db from '../database/knex';
import { getDBClient } from '../utils/helpers';
import HttpStatus from '../utils/http-status';

export default class HealthController {
  static async index(_req: Request, res: Response) {
    let dbStatus = false;
    try {
      await db.raw('select 1');
      dbStatus = true;
    } catch (e) {
    }
    
    res.status(HttpStatus.OK).json({
      webStatus: 'ok',
      webUptime: process.uptime(),
      databaseClient: getDBClient(),
      databaseStatus: dbStatus ? 'ok' : 'disconnected',
    });
  }
}
