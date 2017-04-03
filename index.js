'use strict';

const Nats = require('nats');
const Joi = require('joi');


const optionsSchema = Joi.object().keys({
  nats: Joi.object(),
  topicPrefix: Joi.string().default('durga.rooms')
});


module.exports = class NatsRoomProxy {

  constructor(options) {

    Joi.validate(options || {}, optionsSchema, (err, value) => {
      if(err) {
        throw err;
      }
      this.options = value;
    });

  }

  start() {
    if(!this.nats) {
      this.nats = Nats.connect(this.options.nats);
    } else {
      this.nats.reconnect();
    }
  }

  stop() {
    this.nats.close();
  }

  emit(room, event, payload) {
    this.nats.publish(this._getRoomTopic(room), JSON.stringify({ event, payload }));
  }

  connect(room, emit) {
    this.nats.subscribe(this._getRoomTopic(room), msg => {
      let e = JSON.parse(msg);
      emit(e.event, e.payload);
    });
  }




  _getRoomTopic(room) {
    return `${this.options.topicPrefix}.${room.name}`;
  }

};
