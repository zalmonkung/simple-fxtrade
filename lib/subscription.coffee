{EventEmitter} = require 'events'
{assign} = require './utils'

class Subscription extends EventEmitter
  constructor: (stream, options) ->
    super()
    unless stream? then return

    @connected = false
    @stream = stream
    @options = assign {}, options

    @stream.on 'data', (data) =>
      @connected = true
      if @options.json then data = JSON.parse data.toString()

      @emit 'data', data

    @stream.on 'error', (error) =>
      @connected = false
      @emit 'error', error

    @stream.on 'end', (data) =>
      @connected = false
      @emit 'end', data

  connect: ->
    @stream()
    @connected = true

  disconnect: ->
    @connected = false
    @stream.req.abort()

module.exports = Subscription
