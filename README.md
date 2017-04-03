# durga-rooms-nats

[RoomProxy](https://platdesign.gitbooks.io/durga/content/concepts/proxies.html) for [Durga](https://github.com/durga-js/durga) using [nats.io](https://nats.io/) as transport and distribution layer.


# Install

`npm install --save durga-rooms-nats`


# Usage

```js
const Durga = require('durga');
const NatsRooms = require('durga-rooms-nats');

const server = new Durga.Server({ ... });

server.roomProxy('nats', new NatsRooms({
	
	// will be passed through to nats.connect(options)
	nats: { ... },
	
	// proxy will publish to durga.rooms.[roomName]
	topicPrefix: 'durga.rooms' // -> default

}));

// define room
server.room('foo', 'nats');

// use room
server.room('foo').emit('my-event', { my: 'payload' });
```
