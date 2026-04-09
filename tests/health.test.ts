import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import db from '../src/database/knex';
import { expectHttpError } from '../src/utils/test-helper';

describe('/health', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  
  it('returns 200 and statuses', async () => {
    vi.spyOn(db, 'raw').mockResolvedValue(1);
    
    const { default: app } = await import('../src/app');
    const res = await request(app).get('/health');
    
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      webStatus: 'ok',
      webUptime: expect.schemaMatching(z.number()),
      databaseClient: expect.schemaMatching(z.string()),
      databaseStatus: expect.schemaMatching(z.string()),
    });
  });
  
  it('returns 500 for unexpected internal error', async () => {
    const { default: HealthController } = await import('../src/controllers/health.controller');
    vi.spyOn(HealthController, 'index')
      .mockImplementation(async (req, res) => {
        throw new Error('mock error');
      });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { default: app } = await import('../src/app');
    const res = await request(app).get('/health');
    
    expectHttpError(res, 500);
  });
});
