import _ from 'lodash';
import { EventEmitter } from 'events';

export default class Subscription extends EventEmitter {
  constructor(stream, options) {
    super();
    if (!stream) return;

    this.connected = false;
    this.stream = stream;
    this.options = _.assign({}, { json: true }, options);

    this.stream.on('data', data => {
      this.connected = true;

      if (this.options.json) data = JSON.parse(data.toString());

      this.emit('data', data);
    });

    this.stream.on('error', error => {
      this.connected = false;
      this.emit('error', error);
    });

    this.stream.on('end', data => {
      this.connected = false;
      this.emit('end', data);
    });
  }

  connect() {
    this.stream();
    this.connected = true;
  }

  disconnect() {
    this.connected = false;
    this.stream.abort();
  }
}
