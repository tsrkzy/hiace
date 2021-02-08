/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

"use strict";
const WS = require("ws");

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
  ws.on("message", message => {
    console.log(`received: ${message}`); // @DELETEME
    ws.send(`you send: ${message}`);
  });

  ws.send("hello!");
});
