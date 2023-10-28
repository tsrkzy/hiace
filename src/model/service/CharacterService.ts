import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Character } from "../Character";

const SYSTEM_COLOR = "#EEEEEE";

export const createCharacter = async (props: {
  owner: string;
  name: string;
  roomId: string;
  text?: string;
  activeAlias: string;
  imageId: string;
  showOnInitiative?: boolean;
  chatPosition?: number;
  pawnSize?: number;
  color?: string;
  archived?: boolean;
}): Promise<Character> => {
  const c = {
    owner: props.owner,
    name: props.name,
    room: props.roomId,
    text: props.text ?? "",
    activeAlias: props.activeAlias,
    showOnInitiative: props.showOnInitiative ?? true,
    chatPosition: props.chatPosition ?? 0,
    pawnSize: props.pawnSize ?? 1,
    color: props.color ?? SYSTEM_COLOR,
    archived: props.archived ?? false,
  };
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef);
  await setDoc(docRef, c);
  const { id } = docRef;
  return new Character({
    id,
    name: c.name,
    room: c.room,
    owner: c.owner,
    activeAlias: c.activeAlias,
    chatPosition: c.chatPosition,
    pawnSize: c.pawnSize,
    showOnInitiative: c.showOnInitiative,
    text: c.text,
  });
};
