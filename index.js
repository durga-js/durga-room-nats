'use strict';


// Deps
const Nats = require('nats');
const Joi = require('joi');



// constructor options schema
const optionsSchema = Joi.object().keys({
  nats: Joi.object(),
  topicPrefix: Joi.string().default('durga.rooms')
});





/**
 * RoomProxy for durga rooms using https://nats.io/ as messaging
 * @type {class}
 */
module.exports = class NatsRoomProxy {




  /**
   * Constructor
   * @param  {object} options configuration for proxy and nats connection
   */
  constructor(options) {

    Joi.validate(options || {}, optionsSchema, (err, value) => {
      if(err) {
        throw err;
      }
      this.options = value;
    });

  }




  /**
   * Will be executed during server.start()-hook
   * @return void
   */
  start() {
    if(!this.nats) {
      this.nats = Nats.connect(this.options.nats);
    } else {
      this.nats.reconnect();
    }
  }




  /**
   * Will be executed during server.stop()-hook for clean shutdown
   * @return void
   */
  stop() {
    this.nats.close();
  }




  /**
   * Publishes an event to nats
   * @param  {object} room    room which emits
   * @param  {string} event   name of event
   * @param  {object} payload event payload
   * @return void
   */
  emit(room, event, payload) {
    this.nats.publish(this._getRoomTopic(room), JSON.stringify({ event, payload }));
  }




  /**
   * Subscribes to room topic on nats server and emits received events to room
   * @param  {object} room room which will be subscribed to nats topic
   * @param  {function} emit internalRoomEmitter (emits event to active connections which joined the room)
   * @return void
   */
  connect(room, emit) {
    this.nats.subscribe(this._getRoomTopic(room), msg => {
      let e = JSON.parse(msg);
      emit(e.event, e.payload);
    });
  }




  /**
   * Helper to create room-nats-topic string
   * @param  {object} room room instance
   * @return {string}      nats-topic
   */
  _getRoomTopic(room) {
    return `${this.options.topicPrefix}.${room.name}`;
  }




};
