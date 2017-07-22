import _ from 'lodash';
import { validate } from './utils';

// GET | PATCH /accounts[/:id]
export const accounts = function (req = {}) {
  const { id } = req

  if (this.method === 'PATCH') {
    validate(req, ['id']);

    return this.request({ body: _.omit(req, 'id')}, `accounts/${id}/configuration`, false);
  }

  const route = id ? `accounts/${id}` : 'accounts';

  return this.request(req, route, false);
};

// GET /accounts/:accountId/summary
export const summary = function (req = {}) {
  return this.request(req, `accounts/${this.options.accountId}/summary`);
}

// GET /accounts/:accountId/instruments
export const instruments = function (req = {}) {
  return this.request(req, `accounts/${this.options.accountId}/instruments`);
}

// GET /accounts/:accountId/changes
export const changes = function (req = {}) {
  validate(req, ['sinceTransactionID']);

  return this.request(req, `accounts/${this.options.accountId}/changes`);
};
