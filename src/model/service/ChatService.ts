import { setDoc, doc, collection, writeBatch } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Chat, ChatType, SYSTEM_CHANNEL_ID } from "../Chat";

interface CreateChatProps {
  roomId: string;
  channelId: string;
  aliasId?: string|null;
  characterId?: string|null;
  color?: string;
  userId: string;
  type: ChatType;
  value: { text: string };
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
    type: ChatType.SYSTEM,
    value: { text },
  });
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
      type: ChatType.TEXT,
      value: { text: `dummy_${seq}` },
      timestamp: Date.now() - (amountOfChat - i),
    };
    batch.set(docRef, c);
  }

  await batch.commit();
};


export const scrollChatToBottom = () => {
  const elements = document.getElementsByClassName("chat-row latest");
  if (!elements.length) {
    console.warn("no latest found"); // @DELETEME
    return;
  }
  for (let i = 0; i < elements.length; i++) {
    // {behavior
    elements[i].scrollIntoView();
  }
}