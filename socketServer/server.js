/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

"use strict";

const WS = require("ws");
const { SocketClient, onMessage } = require("./SocketClient");

const wss = new WS.Server({
  port: 3000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,

    concurrencyLimit: 10,
    threshold: 1024
  }
});

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

console.log("start socket-server");
