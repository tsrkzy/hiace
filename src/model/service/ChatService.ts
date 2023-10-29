import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Chat } from "../Chat";

interface CreateChatProps {
  roomId: string;
  channelId: string;
  aliasId: string | null;
  characterId: string | null;
  color: string;
  userId: string;
  type: string;
  value: { text: string };
}

export const createChat = async (props: CreateChatProps): Promise<Chat> => {
  const {
    channelId,
    aliasId,
    characterId,
    color,
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
  });
};
