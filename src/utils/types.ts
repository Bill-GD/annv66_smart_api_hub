import { Request, Response } from 'express';

export type ResourceRequest = Request<
  { resource: string, id: string },
  any,
  any,
  {
    _fields: string,
    _page: string,
    _limit: string,
    _sort: string,
    _order: string,
    _gte: string,
    _lte: string,
    _ne: string,
    _like: string,
    q: string,
    _expand: string,
    _embed: string,
  }
>

export type ResourceResponse = Response<
  any,
  {
    columns: string[]
  }
>;
