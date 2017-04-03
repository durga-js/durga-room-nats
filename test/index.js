'use strict';

const Code = require('code');
const expect = Code.expect;
const Durga = require('durga');
const NatsRoomProxy = require('../');

describe('Durga room proxy nats', () => {

  let server;
  beforeEach(() => {
    server = new Durga.Server({});
    server.roomProxy('nats', new NatsRoomProxy());
    return server.start();
  });

  afterEach(() => server.stop());


  it('should ', (done) => {

    let room = server.room('test', 'nats');
    let con = server.createConnection();

    let emitted = false;

    con.listen(e => {

      expect(emitted)
        .to.be.false();

      emitted = true;

      expect(e)
        .to.equal({
          type: 'event',
          event: 'test',
          payload: { test:123 }
        });

      done();

    });

    room.join(con);

    room.emit('test', { test:123 });

  });

});
