import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { Character } from "../Character";
import { createDefaultAlias, deleteAliasesByCharacter } from "./AliasService";

const SYSTEM_COLOR = "#EEEEEE";

type CreateCharacterProps = {
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
};
/**
 * characterの作成
 * デフォルトのaliasも同時に作成する
 * @param {CreateCharacterProps} props
 */
export const createCharacter = async (
  props: CreateCharacterProps,
): Promise<Character> => {
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

  /* 初期aliasの作成 */
  const alias = await createDefaultAlias({
    roomId: props.roomId,
    characterId: id,
    imageId: "imageId",
  });

  /* 作成したaliasをcharacterに割当 */
  await setActiveAlias({ characterId: id, aliasId: alias.id });

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

type ActiveAliasProps = {
  characterId: string;
  aliasId: string;
};
/**
 * characterのactiveAliasにaliasを設定する
 * @param {ActiveAliasProps} props
 */
export const setActiveAlias = async (
  props: ActiveAliasProps,
): Promise<void> => {
  const { characterId, aliasId } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { activeAlias: aliasId });
};

interface DeleteCharacterProps {
  characterId: string;
}

export const deleteCharacter = async (props: DeleteCharacterProps) => {
  const { characterId } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await deleteDoc(docRef);

  /* 紐づくaliasを削除 */
  await deleteAliasesByCharacter({ characterId });

  /* 紐づくpawnを削除 */
};
