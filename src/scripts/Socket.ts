/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import store from "@/store";
import { Notify } from "@/scripts/Notify";

export const JOIN_ROOM = "JOIN_ROOM";
export const ON_TYPE = "ON_TYPE";

export class Socket extends WebSocket {
  id: string;
  roomId: string | null;

  static Instance: Socket | null;

  constructor(roomId: string) {
    // const uri = "ws://localhost:3000";
    const uri = process.env.VUE_APP_WEB_SOCKET_URI ?? "ws://localhost:3000";
    super(uri);
    this.id = generateId();
    this.roomId = roomId;

    if (!!Socket.Instance) {
      return Socket.Instance;
    }

    Socket.AttachListener(this);
    Socket.Instance = this;
  }

  static Send(key: string, value: object) {
    const socket = Socket.Instance;
    if (!socket) {
      throw new Error("no Socket.Instance");
    }
    if (!value) {
      throw new Error("empty value");
    }

    if ([JOIN_ROOM, ON_TYPE].indexOf(key) === -1) {
      throw new Error(`invalid key: ${key}`);
    }

    socket.send(JSON.stringify({ key, value }));
  }

  static AttachListener(s: Socket) {
    s.addEventListener("close", onCloseHandler, false);
    s.addEventListener("error", onErrorHandler, false);
    s.addEventListener("message", onMessageHandler, false);
    s.addEventListener("open", onOpenHandler, false);
  }

  static RemoveListener(s: Socket) {
    s.removeEventListener("close", onCloseHandler);
    s.removeEventListener("error", onErrorHandler);
    s.removeEventListener("message", onMessageHandler);
    s.removeEventListener("open", onOpenHandler);
  }

  static Dispose() {
    console.log("Socket.Dispose");
    if (!Socket.Instance) {
      return;
    }
    Socket.Instance.roomId = null;
    Socket.RemoveListener(Socket.Instance);
    Socket.Instance = null;
    console.log("dispose completed");
  }
}

function generateId() {
  const userId = store.getters["auth/user"]?.id;
  if (!userId) {
    throw new Error("implement error: cannot get userId");
  }
  const timestamp = Date.now();
  return `${userId}_${timestamp}`;
}

function onCloseHandler(e: CloseEvent) {
  console.error("Socket.onClose", e); // @DELETEME
}

function onErrorHandler(e: Event) {
  console.error("Socket.onError", e); // @DELETEME
  reconnect();
}

function reconnect() {
  console.log("Socket.reconnect"); // @DELETEME
  Socket.Dispose();
  const delay = 5 * 1000;
  setTimeout(() => {
    const roomId = store.getters["room/info"]?.id;
    new Socket(roomId);
  }, delay);
}

function onMessageHandler(e: MessageEvent) {
  const data = parseMessage(e.data);
  if (!data) {
    console.info("[ignored]invalid data", e.data);
    return;
  }

  const { key, value } = data;
  switch (key) {
    case ON_TYPE: {
      const { characterId /*, userName*/ } = value;
      popBalloon(characterId);
    }
  }
}

function popBalloon(characterId: string) {
  const $$s = `div.balloon-holder.alias-${characterId}`;
  const $elList = Array.from(document.querySelectorAll($$s)).filter($e => !!$e);
  const cls = "dimming";
  for (let i = 0; i < $elList.length; i++) {
    const $el = $elList[i];
    if ($el.classList.contains(cls)) {
      $el.classList.remove(cls);
    }
  }
  setTimeout(() => {
    for (let i = 0; i < $elList.length; i++) {
      const $el = $elList[i];
      $el.classList.add(cls);
    }
  }, 10);
}

function onOpenHandler(e: Event) {
  Notify.Log("WebSocket-Connection.established()");
  joinRoom();
  function joinRoom() {
    const id = Socket.Instance?.id;
    const roomId = Socket.Instance?.roomId;
    const value = { id, roomId };

    Socket.Send(JOIN_ROOM, value);
  }
}

function parseMessage(jsonLike: string) {
  try {
    const data = JSON.parse(jsonLike);
    if (!data || !data.key || !data.value) {
      throw new Error(`message is not valid json-string: ${jsonLike}`);
    }
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
}
