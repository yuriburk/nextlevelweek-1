import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = items
      ? String(items)
          .split(',')
          .map((item) => Number(item.trim()))
      : [1, 2, 3, 4, 5, 6];

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const transaction = await knex.transaction();

    try {
      const point = {
        image,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      const insertedIds = await transaction('points').insert(point);

      const point_id = insertedIds[0];

      const pointItems = items.map((item_id: number) => ({
        item_id,
        point_id: point_id,
      }));

      await transaction('point_items').insert(pointItems);

      await transaction.commit();

      return response.json({ id: point_id, ...point });
    } catch {
      transaction.rollback();
      return response.status(500).json('Unknown error in server');
    }
  }
}

export default PointsController;
