//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------
'use strict';
var net = require('net');
require('../lib/socketEx');
var constant_1 = require('../lib/constant');
class App {
    constructor(options) {
        let dstAddr = options.dstAddr;
        let dstPort = options.dstPort || constant_1.defaultServerPort;
        let localPort = options.localPort || constant_1.defaultServerPort;
        let server = net.createServer((socket) => {
            let transitSocket = net.createConnection(dstPort, dstAddr, () => {
                socket.pipe(transitSocket);
                transitSocket.pipe(socket);
            });
            function dispose() {
                transitSocket.dispose();
                socket.dispose();
            }
            transitSocket.on('end', dispose);
            transitSocket.on('error', dispose);
            socket.on('end', dispose);
            socket.on('error', dispose);
        });
        server.on('error', (err) => {
            console.log(err.message);
            process.exit(1);
        });
        server.listen(localPort);
    }
}
exports.App = App;
if (!module.parent) {
    process.title = 'LightSword Bridge Debug Mode';
}