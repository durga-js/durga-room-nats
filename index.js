'use strict';

const Nats = require('nats');



module.exports = class NatsRoomProxy {

  constructor(natsConfig) {
    this.nats = Nats.connect(natsConfig);


  }

  init(server) {
    server.hook('stop', () => this.nats.close());
  }

  getRoomTopic(room) {
    return `durga.rooms.${room.name}.event`;
  }

  emit(room, event, payload) {
    this.nats.publish(this.getRoomTopic(room), JSON.stringify({ event, payload }));
  }

  connect(room) {
    this.nats.subscribe(this.getRoomTopic(room), msg => {
      let e = JSON.parse(msg);
      room._emitLocal(e.event, e.payload);
    });
  }

};
