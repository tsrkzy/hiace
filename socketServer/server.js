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

const ssl_server_crt = "/var/ssl/fullchain.pem";
const ssl_server_key = "/var/ssl/privkey.pem";
const keyExists = fs.existsSync(ssl_server_crt);
const certExists = fs.existsSync(ssl_server_key);

const mode = keyExists && certExists ? "wss" : "ws";
const PORT = 3000;

if (mode === "wss") {
  /* SSL証明書と秘密鍵が存在する場合はsecureモードで起動 */
  console.log(`try to wss:// secure-mode on port:${PORT}`);
  const options = {
    key: fs.readFileSync(ssl_server_key),
    cert: fs.readFileSync(ssl_server_crt)
  };
  const secure_server = https.createServer(options);
  const wss = new WS.Server({
    server: secure_server
  });

  _addListener(wss);

  secure_server.listen(PORT);
  console.log(`start websocket server on wss:// :${PORT}`);
} else {
  /* 証明書が存在しない場合はinsecureモードで起動 */
  console.log(`try to ws:// INsecure-mode on port:${PORT}`);
  const wss = new WS.Server({
    port: PORT,
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

  _addListener(wss);
  console.log(`start INSECURE websocket server on ws:// :${PORT}`);
}

function _addListener(wss) {
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
}
