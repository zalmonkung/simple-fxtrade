import _ from 'lodash';
import { validate } from './utils';

// GET /accounts/:accountId/trades[/:id]
export const trades = function (req = {}) {
  const {id, open} = req;

  if (open) req.state = 'OPEN';

  const route = id ?
    `accounts/${this.options.accountId}/trades/${id}` :
    `accounts/${this.options.accountId}/trades`;

  return this.request(req, route);
};

// PUT /accounts/:accountId/trades/:id/close
trades.close = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/trades/${req.id}/close`);
};

// PUT /accounts/:accountId/trades/:id/clientExtensions
trades.clientExtensions = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/trades/${req.id}/clientExtensions`);
};

// PUT /accounts/:accountId/trades/:id/orders
trades.orders = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/trades/${req.id}/orders`);
};
