import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { Character } from "../Character";
import {
  createAlias,
  createDefaultAlias,
  deleteAliasesByCharacter,
} from "./AliasService";
import { Alias } from "../Alias";
import { postfix } from "../../util/helper";

const SYSTEM_COLOR = "#EEEEEE";

type CreateCharacterProps = {
  owner: string;
  name: string;
  roomId: string;
  text?: string;
  imageId?: string;
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
    activeAlias: "",
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
    imageId: props.imageId || "",
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

export const createCharacterWithoutAlias = async (
  props: CreateCharacterProps,
) => {
  const c = {
    owner: props.owner,
    name: props.name,
    room: props.roomId,
    text: props.text ?? "",
    activeAlias: "",
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

export const cloneCharacter = async (props: {
  characterId: string;
  userId: string;
}) => {
  const { characterId, userId } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  const d = await getDoc(docRef);
  const c = d.data() as Character;
  const { name, room, text, showOnInitiative, chatPosition, pawnSize } = c;
  const { id: srcCharacterId } = docRef;

  /* characterの複製 */
  const newCharacter = await createCharacterWithoutAlias({
    owner: userId,
    name: postfix(name),
    roomId: room,
    text,
    showOnInitiative,
    chatPosition,
    pawnSize,
  });
  const { id: newCharacterId } = newCharacter;

  /* aliasの複製 */
  const aliasCollectionRef = collection(db, "alias");
  const aliasQuery = query(aliasCollectionRef, where("room", "==", room));
  const aliasQuerySnapshot = await getDocs(aliasQuery);

  const aliasPromises: Promise<Alias>[] = [];
  aliasQuerySnapshot.forEach(aliasDoc => {
    const a = aliasDoc.data() as Alias;
    if (a.character === srcCharacterId) {
      const aliasP = createAlias({
        name: a.name,
        roomId: a.room,
        characterId: newCharacterId,
        imageId: a.image,
      });
      console.log(a.name);
      aliasPromises.push(aliasP);
    }
  });

  const aliasList = await Promise.all(aliasPromises);
  await setActiveAlias({
    aliasId: aliasList[0].id,
    characterId: newCharacterId,
  });
};

export const updateCharacterName = async (props: {
  characterId: string;
  name: string;
}) => {
  console.log("CharacterService.updateCharacterName");
  const { characterId, name } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { name });
};

export const updateCharacterText = async (props: {
  characterId: string;
  text: string;
}) => {
  console.log("CharacterService.updateCharacterText");
  const { characterId, text } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { text });
};

export const updateCharacterPawnSize = async (props: {
  characterId: string;
  pawnSize: number;
}) => {
  console.log("CharacterService.updateCharacterPawnSize");
  const { characterId, pawnSize } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { pawnSize });
};

export const updateCharacterShowOnInitiative = async (props: {
  characterId: string;
  showOnInitiative: boolean;
}) => {
  console.log("CharacterService.updateCharacterShowOnInitiative");
  const { characterId, showOnInitiative } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { showOnInitiative });
};

export const updateCharacterChatPosition = async (props: {
  characterId: string;
  chatPosition: number;
}) => {
  console.log("CharacterService.updateCharacterChatPosition");
  const { characterId, chatPosition } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, { chatPosition });
};
