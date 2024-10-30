import dgram from 'dgram';

const PORT = 6789;
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log(`Received ${msg} from ${rinfo.address}:${rinfo.port}`);
    server.send('pong', rinfo.port, rinfo.address, (err) => {
        if (err) {
            console.error('Error sending response:', err);
        }
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(PORT);