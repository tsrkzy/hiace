/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

const uri = process.env.VUE_APP_WEB_SOCKET_URI ?? "ws://localhost:3000";
export const ws = new WebSocket(uri);

ws.addEventListener("close", e => {
  console.log("close", e); // @DELETEME
});
ws.addEventListener("error", e => {
  console.log("error", e); // @DELETEME
});
ws.addEventListener("message", e => {
  console.log("message", e); // @DELETEME
});
ws.addEventListener("open", e => {
  console.log("open", e); // @DELETEME
  ws.send("opened!");
});
