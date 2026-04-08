import { Response } from 'superagent';
import { expect } from 'vitest';
import db from '../database/knex';

export function mockDBObject() {
  return Object.getPrototypeOf(db('mock'));
}

export function expectHttpError(res: Response, status: number) {
  expect(res.headers['content-type']).toMatch(/json/);
  expect(res.status).toBe(status);
  expect(res.body).not.toHaveProperty('token');
  expect(res.body).toHaveProperty('error');
  // @ts-ignore
  expect(res.body.error).toBeTypeOf('string');
}
