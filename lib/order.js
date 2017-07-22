import _  from 'lodash';
import { validate } from './utils';

// GET /accounts/:accountId/orders[/:id]
export const orders = function (req = {}) {
  const { id } = req;

  const route = id ?
    `accounts/${this.options.accountId}/orders/${id}` :
    `accounts/${this.options.accountId}/orders`;

  return this.request(req, route);
};

// POST /accounts/:accountId/orders
orders.create = function (req = {}) {
  validate(req, ['order']);

  return this('post').request({ body: req }, `accounts/${this.options.accountId}/orders`);
};

// PUT /accounts/:accountId/orders/:id
orders.replace = function (req = {}) {
  validate(req, ['id', 'order']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/orders/${req.id}`);
};

// PUT /accounts/:accountId/orders/:id/cancel
orders.cancel = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/orders/${req.id}/cancel`);
};

// PUT /accounts/:accountId/orders/:id/clientExtensions
orders.clientExtensions = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/orders/${req.id}/clientExtensions`);
};
