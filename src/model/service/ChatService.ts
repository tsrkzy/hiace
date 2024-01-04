import { setDoc, doc, collection, writeBatch } from "firebase/firestore";
import { db } from "@/util/firestore";
import {
  Chat,
  type ChatType,
  ChatTypes,
  type ChatValue,
  SYSTEM_CHANNEL_ID,
} from "@/model/Chat";
import { ALIAS_ID_NULL, CHANNEL_ID_NULL, CHARACTER_ID_NULL } from "@/constant";
import { callDiceBot, easyDiceCheck } from "@/util/diceBot";

interface CreateChatProps {
  roomId: string;
  channelId: string;
  aliasId?: string | null;
  characterId?: string | null;
  color?: string;
  userId: string;
  type: ChatType;
  value: ChatValue;
}

export const createChat = async (props: CreateChatProps): Promise<Chat> => {
  const {
    channelId,
    aliasId = null,
    characterId = null,
    color = "#000000",
    userId,
    roomId,
    type,
    value,
  } = props;

  const c = {
    channel: channelId,
    alias: aliasId,
    character: characterId,
    color: color,
    owner: userId,
    room: roomId,
    type: type,
    value: value,
    timestamp: Date.now(),
  };

  const collectionRef = collection(db, "chat");
  const docRef = doc(collectionRef);
  await setDoc(docRef, c);
  const { id } = docRef;
  return new Chat({
    id,
    channel: c.channel,
    alias: c.alias,
    character: c.character,
    color: c.color,
    owner: c.owner,
    room: c.room,
    type: c.type,
    value: c.value,
    timestamp: c.timestamp,
  });
};

interface createSystemChatProps {
  roomId: string;
  text: string;
  userId: string;
}

export const createSystemChat = async (props: createSystemChatProps) => {
  const { roomId, text, userId } = props;

  await createChat({
    roomId,
    channelId: SYSTEM_CHANNEL_ID,
    aliasId: null,
    characterId: null,
    userId,
    type: ChatTypes.SYSTEM,
    value: { text },
  });
};

interface createUserChatProps {
  roomId: string;
  channelId: string;
  aliasId?: string | null;
  characterId?: string | null;
  userId: string;
  text: string;
}

export const createUserChat = async (props: createUserChatProps) => {
  const {
    roomId,
    channelId: _channelId,
    aliasId: _aliasId,
    characterId: _characterId,
    userId,
    text,
  } = props;
  console.log("_channelId", _channelId);
  await createChat({
    roomId,
    channelId: _channelId === CHANNEL_ID_NULL ? SYSTEM_CHANNEL_ID : _channelId,
    aliasId: _aliasId === ALIAS_ID_NULL ? null : _aliasId,
    characterId: _characterId === CHARACTER_ID_NULL ? null : _characterId,
    userId,
    type: ChatTypes.TEXT,
    value: { text },
  });
};

interface createDiceBotChatProps {
  roomId: string;
  channelId: string;
  aliasId?: string | null;
  characterId?: string | null;
  userId: string;
  value: {
    text: string;
    command: string;
    result: string;
    secret: boolean;
  };
}

export const createDiceBotChat = async (
  props: createDiceBotChatProps,
  isSecret: boolean = false,
) => {
  console.log("ChatService.createDiceBotChat", props);
  const type = isSecret ? ChatTypes.DICE_SECRET : ChatTypes.DICE;
  const {
    roomId,
    channelId: _channelId,
    aliasId: _aliasId,
    characterId: _characterId,
    userId,
    value,
  } = props;
  await createChat({
    roomId,
    channelId: _channelId === CHANNEL_ID_NULL ? SYSTEM_CHANNEL_ID : _channelId,
    aliasId: _aliasId === ALIAS_ID_NULL ? null : _aliasId,
    characterId: _characterId === CHARACTER_ID_NULL ? null : _characterId,
    userId,
    type,
    value,
  });
};

interface sendChatProps {
  roomId: string;
  channelId: string;
  userId: string;
  characterId: string | null;
  aliasId: string | null;
  text: string;
}

export const sendChat = async (props: sendChatProps, gameSystem?: string) => {
  const { text } = props;

  if (!text.trim()) {
    console.log("ChatService.sendChat: text is empty");
    return;
  }

  const isCommand = easyDiceCheck(text);
  if (!gameSystem || !isCommand) {
    return await createUserChat(props);
  }

  try {
    const { ok, result, reason, secret } = await callDiceBot(gameSystem, text);

    if (!ok) {
      throw new Error(`diceBot: ${reason}`);
    }

    const value = {
      text,
      command: text,
      result: result,
      secret: secret,
    };

    // ヒストリーに追加 @TODO

    return await createDiceBotChat({
      roomId: props.roomId,
      channelId: props.channelId,
      userId: props.userId,
      characterId: props.characterId,
      aliasId: props.aliasId,
      value,
    });
  } catch (e) {
    /* 簡易チェックで引っかかったが、BCDiceはコマンドと判定しなかった */
    console.warn(e);
  }

  return await createUserChat(props);
};

interface insertDummyChatProps {
  roomId: string;
  userId: string;
}

export const insertDummyChat = async (
  amountOfChat: number,
  props: insertDummyChatProps,
) => {
  const { roomId, userId } = props;
  console.log("ChatService.insertDummyChat", roomId, userId);
  const batch = writeBatch(db);
  const collectionRef = collection(db, "chat");

  for (let i = 0; i < amountOfChat; i++) {
    const seq = `${i}`.padStart(4, "0");

    const docRef = doc(collectionRef);
    const c = {
      channel: SYSTEM_CHANNEL_ID,
      alias: null,
      character: null,
      color: "#000000",
      owner: userId,
      room: roomId,
      type: ChatTypes.TEXT,
      value: { text: `dummy_${seq}` },
      timestamp: Date.now() - (amountOfChat - i),
    };
    batch.set(docRef, c);
  }

  await batch.commit();
};

export const getScrollParentClasses = (floatId: number): string[] => {
  return ["scroll-parent", `float-${floatId}`];
};

export const scrollChatToBottom = (floatId: number) => {
  console.log("ChatService.scrollChatToBottom", floatId);
  const selector = getScrollParentClasses(floatId)
    .map(s => `.${s}`)
    .join("");
  const scrollParent = document.querySelector(selector);
  if (!scrollParent) {
    console.warn("scroll target not found");
    return;
  }
  scrollParent.scrollTop = scrollParent.scrollHeight;
};
