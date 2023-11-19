/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { createNotice } from "@/model/service/NoticeService";


export const SocketMessageType = {
  JOIN_ROOM: "JOIN_ROOM",
  ON_TYPE: "ON_TYPE",
  TOUCH: "TOUCH",
} as const;
export type SocketMessageType = (typeof SocketMessageType)[keyof typeof SocketMessageType];

export class Socket extends WebSocket {
  id: string;
  roomId: string|null;
  userId: string|null;


  static Instance: Socket|null;

  constructor(roomId: string, userId: string) {
    const uri = import.meta.env.VITE_WEB_SOCKET_URI ?? "ws://localhost:3000";
    super(uri);
    this.id = generateId(userId);
    this.roomId = roomId;
    this.userId = userId;

    if (Socket.Instance) {
      return Socket.Instance;
    }

    Socket.Instance = this;
    this.attachListener();
  }

  static Send(key: string, value: object) {
    const socket = Socket.Instance;
    if (!socket) {
      throw new Error("no Socket.Instance");
    }
    if (!value) {
      throw new Error("empty value");
    }

    if (!Object.values(SocketMessageType).includes(key as SocketMessageType)) {
      throw new Error(`invalid key: ${key}`);
    }

    socket.send(JSON.stringify({ key, value }));
  }

  static AttachListener() {
    Socket.Instance?.attachListener()
  }

  attachListener() {
    this.addEventListener("close", this.onCloseHandler, false);
    this.addEventListener("error", this.onErrorHandler, false);
    this.addEventListener("message", this.onMessageHandler, false);
    this.addEventListener("open", this.onOpenHandler, false);
  }

  static RemoveListener() {
    Socket.Instance?.removeListener()
  }

  removeListener() {
    this.removeEventListener("close", this.onCloseHandler);
    this.removeEventListener("error", this.onErrorHandler);
    this.removeEventListener("message", this.onMessageHandler);
    this.removeEventListener("open", this.onOpenHandler);
  }

  onCloseHandler(e: CloseEvent) {
    console.error("Socket.onClose", e); // @DELETEME
  }

  onErrorHandler(e: Event) {
    console.error("Socket.onError", e); // @DELETEME
    this.reconnect();
  }

  reconnect() {
    const { roomId, userId } = this;
    console.log("Socket.reconnect"); // @DELETEME
    Socket.Dispose();
    const delay = 5 * 1000;
    setTimeout(() => {
      if (roomId && userId) {
        new Socket(roomId, userId);
      }
    }, delay);
  }

  onMessageHandler(e: MessageEvent) {
    const data = parseMessage(e.data);
    if (!data) {
      console.info("[ignored]invalid data", e.data);
      return;
    }

    const { key, value } = data;
    switch (key) {
      case SocketMessageType.ON_TYPE: {
        const { characterId /*, userName*/ } = value;
        popBalloon(characterId);
        break;
      }
      case SocketMessageType.TOUCH: {
        const { message } = value;
        createNotice(message);
        break;
      }
    }
  }

  onOpenHandler() {
    createNotice("接続確立");
    joinRoom();

    function joinRoom() {
      const id = Socket.Instance?.id;
      const roomId = Socket.Instance?.roomId;
      const value = { id, roomId };

      Socket.Send(SocketMessageType.JOIN_ROOM, value);
    }
  }


  static Dispose() {
    console.log("Socket.Dispose");
    if (!Socket.Instance) {
      return;
    }
    Socket.Instance.roomId = null;
    Socket.Instance.userId = null;
    Socket.RemoveListener();
    Socket.Instance = null;
    console.log("dispose completed");
  }
}

function generateId(userId: string) {
  const timestamp = Date.now();
  return `${userId}_${timestamp}`;
}


export function popBalloon(characterId: string) {
  const selector = `div[data-character-id=${characterId}].balloon-container`

  const elList = Array.from(document.querySelectorAll(selector))
    .filter((e) => !!e);

  const d = Date.now();
  for (let i = 0; i < elList.length; i++) {
    elList[i].style.opacity = "1";
    elList[i].dataset.key = `${d}`;
  }

  setTimeout(() => {
    for (let i = 0; i < elList.length; i++) {
      if (elList[i].dataset.key !== `${d}`) {
        return
      }
      elList[i].style.opacity = "0";
      elList[i].dataset.key = "";
    }
  }, 1000);
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
