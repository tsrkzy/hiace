import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";
import { FSCharacter } from "@/collections/Character";
import { callDiceBot } from "@/scripts/diceBot";
import { diceroll } from "@/scripts/diceroll";
import { ring } from "@/scripts/DoorBell";

export const TEXT = "TEXT";
export const DICE = "DICE";
export const SYSTEM = "SYSTEM";

export const SYSTEM_COLOR = "#000000";

export class FSChat {
  static unsubscribeMap = new Map();

  static async Create(params: {
    type: string;
    room: string;
    channel: string;
    owner: string;
    character: string | null;
    alias: string | null;
    value: any;
  }) {
    const {
      type,
      room,
      channel,
      owner,
      character = null,
      alias = null,
      value = {}
    } = params;

    if (!room) {
      console.error(room);
      throw new Error("no roomId given");
    }

    /* チャット送信時のキーワードトリガー */
    // onSendingChat(type, value);

    const db = firebase.firestore();
    const timestamp = Date.now();

    const color = FSChat.getColor(owner, character);

    const c = {
      type,
      color,
      room,
      channel,
      owner,
      character,
      alias,
      value,
      timestamp
    };
    const chatDocRef = await db.collection("chat").add(c);
    const id = chatDocRef.id;

    /* キャラクタの最終発言日時を更新 */
    if (character) {
      await FSCharacter.UpdateLastPostDatetime(character);
    }

    return { id, ...c };
  }

  static async Welcome(roomId: string, owner: string) {
    const c = {
      type: SYSTEM,
      room: roomId,
      channel: SYSTEM_CHANNEL_ID, // As CHANNEL_SYSTEM
      owner: owner,
      character: null,
      alias: null,
      value: { text: "welcome to hiace!" }
    };
    await FSChat.Create(c);
  }

  static getColor(userId: string, characterId: string | null) {
    const character = store.getters["character/info"].find(
      (c: { id: string; color: string }) => c.id === characterId
    );
    if (character && character.color) {
      return character.color;
    }
    const user = store.getters["user/info"].find(
      (u: { id: string; color: string }) => u.id === userId
    );
    if (user && user.color) {
      return user.color;
    }
    return SYSTEM_COLOR;
  }

  static async BroadcastLoggedIn({
    roomId,
    user
  }: {
    roomId: string;
    user: { id: string; email: string };
  }) {
    const { id: userId, email } = user;
    const c = {
      type: SYSTEM,
      room: roomId,
      channel: SYSTEM_CHANNEL_ID,
      owner: userId,
      character: null,
      alias: null,
      value: { text: `logged in - - - ${email} - - -` }
    };
    return await FSChat.Create(c);
  }

  static async Chat(
    params: {
      room: string;
      channel: string;
      owner: string;
      character: string | null;
      alias: string | null;
      value: any;
    },
    system?: string
  ) {
    /* trim済みの文字列を渡す */
    const { text = "" } = params.value;

    /* 内容が空文字または空白文字のみ */
    const emptyText = text.trim().length === 0;
    if (emptyText) {
      return;
    }

    /* TRPGシステムを指定しない */
    const noSystem = typeof system !== "string" || !system;

    /* 簡易DiceBotコマンド判定: 任意の半角英数字記号の2文字以上の繰り返しで始まる文字列 */
    const diceBotRegex = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{2,}/;
    const isCommand = diceBotRegex.test(text);

    let type = TEXT;
    if (noSystem || !isCommand) {
      /* 通常チャットとして扱う */
      const c = {
        type,
        ...params
      };
      return await FSChat.Create(c);
    }

    try {
      if (!system || !text) {
        throw new Error("game system or command is empty");
      }

      const { ok, result, reason } = await callDiceBot(system, text);
      if (!ok) {
        throw new Error(`diceBot: ${reason}`);
      }

      /* diceBotが正常にコマンドを実行した */
      params.value.command = text;
      params.value.result = result;
      type = DICE;
    } catch (e) {
      /* diceBotがコマンドとして解釈しなかった */
      console.warn(e);
    }

    return await FSChat.Create({ type, ...params });
  }

  static SetListener(roomId: string) {
    console.log("Chat.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSChat;
    if (unsubscribeMap.has(roomId)) {
      FSChat.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db
      .collection("chat")
      .where("room", "==", roomId)
      .orderBy("timestamp", "asc");

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      /* リスナ付与後、初回にハンドラはクエリに対する全ドキュメントをsnapshotとして受け取る
       * それらはchange.type==="added"のため、type==="added"のHookは画面呼出直後にバーストする
       *
       * チャットの単発の追加はadd、それ以外はsetでハンドルするため、下記の条件で分岐している
       */
      const changes = querySnapshot.docChanges();
      const simpleAdd = changes.length === 1 && changes[0].type === "added";
      if (simpleAdd) {
        /* push */
        const change = changes[0];
        const chat = change.doc.data();
        chat.id = change.doc.id;
        onReceiveChat(chat);

        store.dispatch("chat/addChat", { chat });
      } else {
        /* = chat[] */
        const chats: any[] = [];
        querySnapshot.forEach(doc => {
          const chat = doc.data();
          chat.id = doc.id;
          chats.push(chat);
        });
        store.dispatch("chat/setChats", { chats });
      }
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSChat;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);

    store.dispatch("chat/flush");
  }

  static async AddBulk(roomId: string) {
    const db = firebase.firestore();
    const me = store.getters["auth/user"].id;

    const BATCH_LIMIT = 500;
    const batch = db.batch();
    for (let i = 0; i < BATCH_LIMIT; i++) {
      const newChatRef = db.collection("chat").doc();

      const c = {
        type: TEXT,
        color: "#000000",
        room: roomId,
        channel: null,
        owner: me,
        character: null,
        alias: null,
        value: { text: `bulk inserted: ${i}` },
        timestamp: Date.now() - (BATCH_LIMIT - i)
      };
      batch.set(newChatRef, c);
    }
    await batch.commit();
  }
}

// function onSendingChat(chatType: string, chatValue?: any) {}

function onReceiveChat(chat: firebase.firestore.DocumentData) {
  if (chat.type === DICE) {
    diceroll();
    return;
  }

  const background = store.getters["room/windowInBackground"];
  if (background) {
    ring();
  }
}
