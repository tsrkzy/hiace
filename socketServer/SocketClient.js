/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

class SocketClient {
  id;
  roomId;
  ws;

  static IdMap = new Map();
  static RoomMap = new Map();
  static WsMap = new Map();
  constructor(id, roomId, ws) {
    this.id = id;
    this.roomId = roomId;
    this.ws = ws;
    SocketClient.IdMap.set(id, this);
    SocketClient.WsMap.set(ws, this);

    const socketsInRoom = SocketClient.GrabByRoom(roomId);
    socketsInRoom.push(this);
    SocketClient.RoomMap.set(roomId, socketsInRoom);
  }

  static GetById(id) {
    return SocketClient.IdMap.get(id);
  }

  static GetByWs(ws) {
    return SocketClient.WsMap.get(ws);
  }

  static GrabByRoom(roomId) {
    return SocketClient.RoomMap.get(roomId) ?? [];
  }

  static Stats() {
    const { RoomMap } = SocketClient;
    const entries = Array.from(RoomMap.entries());
    for (let i = 0; i < entries.length; i++) {
      const [roomId, sockets] = entries[i];
      console.log(`[${roomId}] connect: ${sockets.length}`);
      for (let j = 0; j < sockets.length; j++) {
        const socket = sockets[j];
        console.log(` - ${socket.id}`);
      }
    }
  }

  static Dispose(ws) {
    console.log("SocketClient.Dispose"); // @DELETEME
    const client = SocketClient.GetByWs(ws);
    if (!client) {
      return;
    }

    const { id, roomId } = client;
    SocketClient.IdMap.delete(id);
    SocketClient.WsMap.delete(ws);
    const socketsInRoom = SocketClient.GrabByRoom(roomId);
    const index = socketsInRoom.findIndex(s => s === client);
    if (index !== -1) {
      socketsInRoom.splice(index, 1);
    }
  }

  static SendTo(client, packet) {
    if (!(client instanceof SocketClient)) {
      throw new Error("SendTo: client must be instance of SocketClient");
    }
    if (!(packet instanceof Packet)) {
      throw new Error("SendTo: invalid argument");
    }

    const jsonStr = JSON.stringify(packet);
    console.log("SocketClient.SendTo: ", jsonStr); // @DELETEME
    client.ws.send(jsonStr);
  }

  broadcast(packet) {
    const { roomId } = this;
    const clientsInRoom = SocketClient.GrabByRoom(roomId);
    for (let i = 0; i < clientsInRoom.length; i++) {
      const c = clientsInRoom[i];
      if (c === this) {
        continue;
      }
      SocketClient.SendTo(c, packet);
    }
  }

  static Announce(roomId, packet) {
    const clientsInRoom = SocketClient.GrabByRoom(roomId);
    for (let i = 0; i < clientsInRoom.length; i++) {
      const c = clientsInRoom[i];
      SocketClient.SendTo(c, packet);
    }
  }
}

const DEBUG = "DEBUG";
const JOIN_ROOM = "JOIN_ROOM";
const ON_TYPE = "ON_TYPE";

function onMessage(ws, jsonLike) {
  const data = _parseMessage(jsonLike);
  if (!data) {
    return;
  }
  const {
    key,
    value: { id, roomId }
  } = data;

  console.log(`server.onMessage: ${key}`); // @DELETEME
  switch (key) {
    case JOIN_ROOM: {
      new SocketClient(id, roomId, ws);
      SocketClient.Stats();
      break;
    }
    case ON_TYPE: {
      const socket = SocketClient.GetByWs(ws);
      const packet = new Packet(ON_TYPE, data.value);
      socket.broadcast(packet);
      break;
    }
    case DEBUG: {
      console.log("[DEBUG] got key:DEBUG message."); // @DELETEME
      break;
    }
  }
}

function _parseMessage(jsonLike) {
  try {
    const jsonObj = JSON.parse(jsonLike);
    if (!jsonObj || !jsonObj.key || !jsonObj.value) {
      throw new Error(`message is not valid json-string: ${jsonLike}`);
    }
    return jsonObj;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

class Packet {
  key;
  value;
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    const { key, value } = this;
    return JSON.stringify({ key, value });
  }
}

/* export  */
exports.SocketClient = SocketClient;
exports.onMessage = onMessage;
