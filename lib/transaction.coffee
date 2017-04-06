_ = require 'lodash'
{validate} = require './utils'

# GET /accounts/:accountId/transactions[/:id]
exports.transactions = (req = {}) ->
  {id} = req
  route = switch
    when id? then "accounts/#{@options.accountId}/transactions/#{id}"
    else "accounts/#{@options.accountId}/transactions"

  return @request req, route

# GET /accounts/:accountId/transactions[/:id]
exports.transactions = (req = {}) ->
  {id} = req
  route = switch
    when id? then "accounts/#{@options.accountId}/transactions/#{id}"
    else "accounts/#{@options.accountId}/transactions"

  return @request req, route

# TODO: Consider the idrange, sinceid routes.

# GET /accounts/:accountId/transactions/stream
exports.transactions.stream = (req = {}) ->
  req.uri = @endpoint "accounts/#{@options.accountId}/transactions/stream", 'stream'

  return @subscribe req