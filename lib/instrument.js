import _ from 'lodash';
import { validate } from './utils';

// GET /instruments/:accountId/candles
export const candles = function (req = {}) {
  validate(req, ['id']);

  return this.request(req, `instruments/${req.id}/candles`, false);
};
