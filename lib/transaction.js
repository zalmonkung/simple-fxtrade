import _ from 'lodash';
import { validate } from './utils';

// GET /accounts/:accountId/transactions[/:id]
export const transactions = function (req = {}) {
  const {id} = req;

  const route = id ?
    `accounts/${this.options.accountId}/transactions/${id}` :
    `accounts/${this.options.accountId}/transactions`;

  return this.request(req, route);
};

// TODO: Consider the idrange, sinceid routes.

// GET /accounts/:accountId/transactions/stream
transactions.stream = function (req = {}) {
  return this.subscribe(req, `accounts/${this.options.accountId}/transactions/stream`);
};
