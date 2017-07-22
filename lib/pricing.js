import _ from 'lodash';
import { validate } from './utils';

// GET /accounts/:id/pricing
export const pricing = function (req = {}) {
  validate(req, ['instruments']);

  return this.request(req, `accounts/${this.options.accountId}/pricing`);
};

// GET /accounts/:id/pricing/stream
pricing.stream = function (req = {}) {
  validate(req, ['instruments']);

  return this.subscribe(req, `accounts/${this.options.accountId}/pricing/stream`);
};
