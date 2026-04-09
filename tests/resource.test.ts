import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HttpStatus from '../src/utils/http-status';
import { expectHttpError } from '../src/utils/test-helper';
import { ResourceRequest, ResourceResponse } from '../src/utils/types';

describe('/:resource', () => {
  describe('/', () => {
    afterEach(() => {
      vi.clearAllMocks();
      vi.resetModules();
    });
    
    it('returns 400 for invalid resource name', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      
      const { default: app } = await import('../src/app');
      const res = await request(app).get('/notrealresource');
      
      expectHttpError(res, 400);
    });
    
    it('returns 400 for invalid resource fields', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(false);
      
      const { default: app } = await import('../src/app');
      let res = await request(app).get('/realresource?_fields=notrealfield');
      expectHttpError(res, 400);
    });
    
    it('returns 400 for invalid fields filtering', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(false);
      
      const { default: app } = await import('../src/app');
      const res = await request(app).get('/realresource?notrealfield=1234');
      expectHttpError(res, 400);
    });
    
    it('returns 429 after reaching rate limit', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      
      const { default: app } = await import('../src/app');
      
      for (let i = 0; i < 10; i++) {
        await request(app).get('/realresource');
      }
      
      const res = await request(app).get('/realresource');
      expectHttpError(res, 429);
    });
    
    it('returns 200 and rate limit headers on successful get', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(true);
      
      const { default: ResourceController } = await import('../src/controllers/resource.controller');
      vi.spyOn(ResourceController, 'getAll')
        .mockImplementation(async (_req: ResourceRequest, res: ResourceResponse) => {
          res.status(HttpStatus.OK).json([]);
        });
      
      const { default: app } = await import('../src/app');
      
      const res = await request(app).get('/realresource');
      
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('x-ratelimit-limit');
      expect(res.headers).toHaveProperty('x-ratelimit-remaining');
    });
    
    it('returns 401 when post but token is not provided/invalid', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(true);
      
      vi.doMock('../src/middlewares/validate-body.middleware', () => ({
        default: async (_req: any, _res: any, next: () => any) => next(),
      }));
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/realresource')
        .send({});
      
      expect(res.status).toBe(401);
    });
    
    it('returns 403 when post but user not authorized', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(true);
      
      vi.doMock('../src/middlewares/validate-body.middleware', () => ({
        default: async (_req: any, _res: any, next: () => any) => next(),
      }));
      
      const { default: CryptoService } = await import('../src/services/crypto.service');
      vi.spyOn(CryptoService, 'verifyToken').mockReturnValue({
        email: '',
        id: 0,
        password: '',
        username: '',
        // @ts-ignore
        role: '',
      });
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/realresource')
        .set('Authorization', 'Bearer realtoken')
        .send({});
      
      expect(res.status).toBe(403);
    });
    
    it('returns 201 on successful post', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(true);
      
      const { default: ResourceController } = await import('../src/controllers/resource.controller');
      vi.spyOn(ResourceController, 'postOne')
        .mockImplementation(async (_req: ResourceRequest, res: ResourceResponse) => {
          res.status(HttpStatus.CREATED).json({});
        });
      
      vi.doMock('../src/middlewares/validate-body.middleware', () => ({
        default: async (_req: any, _res: any, next: () => any) => next(),
      }));
      
      const { default: CryptoService } = await import('../src/services/crypto.service');
      vi.spyOn(CryptoService, 'verifyToken').mockReturnValue({
        email: '',
        id: 0,
        password: '',
        username: '',
        role: 'user',
      });
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/realresource')
        .set('Authorization', 'Bearer realtoken')
        .send({});
      
      expect(res.status).toBe(201);
    });
  });
  
  describe('/:id', () => {
    it('returns 200 on successful get', async () => {
      const resourceUtils = await import('../src/utils/helpers');
      vi.spyOn(resourceUtils, 'checkResource').mockResolvedValue(true);
      vi.spyOn(resourceUtils, 'checkField').mockResolvedValue(true);
      
      const { default: ResourceController } = await import('../src/controllers/resource.controller');
      vi.spyOn(ResourceController, 'getOne')
        .mockImplementation(async (_req: ResourceRequest, res: ResourceResponse) => {
          res.status(HttpStatus.OK).json({});
        });
      
      const { default: app } = await import('../src/app');
      
      const res = await request(app).get('/realresource/1');
      
      expect(res.status).toBe(200);
    });
  });
});
