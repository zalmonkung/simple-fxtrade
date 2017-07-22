const _ = require('lodash');
const { validate } = require('./utils');

// GET /accounts/:accountId/[positions[/:id]|openPositions]
export const positions = function (req = {}) {
  const { id, open } = req;

  let route;
  if (id) route = `accounts/${this.options.accountId}/positions/${id}`
  else if (open) route = `accounts/${this.options.accountId}/openPositions`;
  else route = `accounts/${this.options.accountId}/positions`;

  return this.request(req, route);
};

// PUT /accounts/:accountId/positions/:id/close
positions.close = function (req = {}) {
  validate(req, ['id']);

  return this('put').request({
    body: _.omit(req, 'id')
  }, `accounts/${this.options.accountId}/positions/${req.id}/close`);
};
