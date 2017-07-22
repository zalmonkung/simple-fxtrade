import _ from 'lodash';
import rp from 'request-promise-native';
import request from 'request';
import resources from './lib';
import Subscription from './lib/subscription';

// Return a replacement with the new httpMethod
const fx = function(method) {
  fx.method = _.toUpper(method);
  return fx;
}

// Allows configuration of the fx api
fx.configure = function (options) { return this.options = _.assign({}, this.options, options) };

// Set the account id context as its needed for most routes
fx.setAccount = function (id) { this.options.accountId = id };

// Set the accept date time format
fx.setDateTimeFormat = function (format) {
  if (!_.includes(['UNIX', 'RFC3339'], format))
    throw new Error('invalid date time format')

  this.options.dateTimeFormat = format;
}

// Execute a raw request
fx.request = function (req, route, checkAccount = true) {
  _validateRequest(this.options, checkAccount);

  const method = this.method ? this.method : 'GET';
  this.method = null;

  return rp({
    method,
    uri: req.uri ? req.uri : this.endpoint(route),
    headers: {
      Authorization: `Bearer ${this.options.apiKey}`,
      'Accept-Datetime-Format': this.options.dateTimeFormat,
    },
    body: req.body,
    qs: _.omit(req, 'body'),
    resolveWithFullResponse: !this.options.throwHttpErrors,
    simple: this.options.throwHttpErrors,
    json: req.json != undefined ? req.json : true,
  })
}

fx.subscribe = function (req, route, checkAccount = true) {
  _validateRequest(this.options, checkAccount);

  const options = {
    method: this.method,
    uri: req.uri ? req.uri : this.endpoint(route, 'stream'),
    headers: {
      Authorization: `Bearer ${this.options.apiKey}`,
      'Accept-Datetime-Format': this.options.dateTimeFormat,
    },
    qs: _.omit(req, 'body'),
    json: req.json != undefined ? req.json : true,
  }

  this.method = null

  return new Subscription(request(options, (err, res) => {
    if (err) throw new Error(`Failed to subscribe to: ${options.uri}`);
  }), { json: options.json });
}

// Get the fx api endpoint adjusted per route
fx.endpoint = function (route = '', mode = 'api') {
  const {live, version} = this.options;

  if (!_.includes(['api', 'stream'], mode)) throw new Error('invalid mode');

  return live ?
    `https://${mode}-fxtrade.oanda.com/${version}/${route}` :
    `https://${mode}-fxpractice.oanda.com/${version}/${route}`;
}

// Ensure certain options are set before request execution
const _validateRequest = (options, checkAccount) => {
  if (!options.apiKey) throw new Error('Api key is not set. Use configure or env OANDA_API_KEY');

  if (checkAccount && !options.accountId) throw new Error('Account id must be set for this request');
}

// Ensure deep binding
const _bindAll = (source, target) => {
  _.each(source, (srcFn, srcName) => {
    target[srcName] = _.bind(srcFn, target);

    _.each(srcFn, (fn, fnName) => target[srcName][fnName] = _.bind(fn, target));
  })

  return target;
}

// Bootstrap the api
const bootstrap = () => {
  // Configure the defaults here
  fx.configure({
    apiKey: process.env.OANDA_API_KEY,
    live: false,
    version: 'v3',
    dateTimeFormat: 'RFC3339',
    throwHttpErrors: true,
  });

  // Attach additional functions to the api
  _.assign(fx, resources);

  return _bindAll(resources, fx);
}

module.exports = bootstrap()
