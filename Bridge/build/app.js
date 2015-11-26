//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------
'use strict';
var net = require('net');
class App {
    constructor(options) {
        let dstAddr = options.dstAddr;
        let dstPort = options.dstPort || 23333;
        let localPort = options.localPort || 22333;
        let server = net.createServer((socket) => {
            let transitSocket = net.createConnection(dstPort, dstAddr, () => {
                socket.pipe(transitSocket);
                transitSocket.pipe(socket);
            });
            function dispose() {
                transitSocket.removeAllListeners();
                transitSocket.end();
                transitSocket.destroy();
                socket.removeAllListeners();
                socket.end();
                socket.destroy();
            }
            transitSocket.on('end', dispose);
            transitSocket.on('error', dispose);
            socket.on('end', dispose);
            socket.on('error', dispose);
        });
        server.on('error', (err) => {
            console.log(err);
            process.exit(1);
        });
        server.listen(localPort);
    }
}
exports.App = App;
if (!module.parent) {
    process.title = 'LightSword Bridge Debug Mode';
}
