import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import CryptoService from '../src/services/crypto.service';
import { expectHttpError, mockDBObject } from '../src/utils/test-helper';

describe('/auth', () => {
  describe('/login', () => {
    it('returns 200 and token on successful login', async () => {
      vi.spyOn(mockDBObject(), 'first')
        .mockResolvedValue({
          'email': 'example@gmail.com',
          'password': 'hashedpassword',
        });
      vi.spyOn(CryptoService, 'verifyPassword').mockReturnValue(true);
      vi.spyOn(CryptoService, 'generateToken').mockReturnValue('mocktoken');
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/login')
        .send({
          'email': 'example@gmail.com',
          'password': 'examplepassword',
        });
      
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
    
    it('returns 400 and error message on invalid body', async () => {
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/login')
        .send({
          'username': 'exampleuser',
          'password': 'examplepassword',
        });
      
      expectHttpError(res, 400);
    });
    
    it('returns 403 and error message on invalid credentials', async () => {
      vi.spyOn(mockDBObject(), 'first')
        .mockResolvedValue({
          'email': 'example@gmail.com',
          'password': 'hashedpassword',
        });
      vi.spyOn(CryptoService, 'verifyPassword').mockReturnValue(false);
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/login')
        .send({
          'email': 'example@gmail.com',
          'password': 'examplepassword',
        });
      
      expectHttpError(res, 403);
    });
  });
  
  describe('/register', () => {
    it('returns 201 on successful registration', async () => {
      vi.spyOn(mockDBObject(), 'first').mockResolvedValue(undefined);
      vi.spyOn(mockDBObject(), 'insert').mockResolvedValue([1]);
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/register')
        .send({
          'username': 'exampleuser',
          'email': 'example@gmail.com',
          'password': 'examplepassword',
        });
      
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.status).toBe(201);
    });
    
    it('returns 400 and error message on invalid body', async () => {
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/register')
        .send({
          'email': 'example@gmail.com',
          'password': 'examplepassword',
        });
      
      expectHttpError(res, 400);
    });
    
    it('returns 409 and error message if email already taken', async () => {
      vi.spyOn(mockDBObject(), 'first')
        .mockResolvedValue({ 'email': 'example@gmail.com' });
      
      const { default: app } = await import('../src/app');
      const res = await request(app)
        .post('/auth/register')
        .send({
          'username': 'exampleuser',
          'email': 'example@gmail.com',
          'password': 'examplepassword',
        });
      
      expectHttpError(res, 409);
    });
  });
});
