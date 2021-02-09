/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

"use strict";

const https = require("https");
const fs = require("fs");
const WS = require("ws");
const { SocketClient, onMessage } = require("./SocketClient");

/* wss:// */
const ssl_server_crt = "/var/ssl/fullchain.pem";
const ssl_server_key = "/var/ssl/privkey.pem";

const options = {
  key: fs.readFileSync(ssl_server_key),
  cert: fs.readFileSync(ssl_server_crt)
};
const secure_server = https.createServer(options);
const wss = new WS.Server({
  server: secure_server
});

/* ws://*/
// const wss = new WS.Server({
//   port: 3000,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024
//     },
//     clientNoContextTakeover: true,
//     serverNoContextTakeover: true,
//     serverMaxWindowBits: 10,
//
//     concurrencyLimit: 10,
//     threshold: 1024
//   }
// });

wss.on("connection", ws => {
  console.log("connection");
  ws.on("message", message => {
    onMessage(ws, message);
  });

  ws.on("close", () => {
    console.log("close"); // @DELETEME
    SocketClient.Dispose(ws);
  });
});

secure_server.listen(3000);
console.log("start socket-server");
