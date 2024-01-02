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
import { db } from "@/util/firestore";
import { Character } from "@/model/Character";
import {
  createAlias,
  createDefaultAlias,
  deleteAliasesByCharacter,
} from "@/model/service/AliasService";
import { Alias } from "@/model/Alias";
import { postfix } from "@/util/helper";

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

export const fetchCharacter = async (
  characterId: string,
): Promise<Character> => {
  const characterDoc = await getDoc(doc(db, "character", characterId));
  if (!characterDoc.exists()) {
    throw new Error(`Character ${characterId} not found`);
  }
  const c = characterDoc.data();
  return new Character({
    id: characterDoc.id,
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
  const c = await fetchCharacter(characterId);
  const {
    id: srcCharacterId,
    name,
    room,
    text,
    showOnInitiative,
    chatPosition,
    pawnSize,
  } = c;

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

interface UpdateCharacterProps {
  characterId: string;
  criteria: object;
}

export const updateCharacter = async (props: UpdateCharacterProps) => {
  const { characterId, criteria } = props;
  const collectionRef = collection(db, "character");
  const docRef = doc(collectionRef, characterId);
  await updateDoc(docRef, criteria);
};

export const increasePawnSize = async (props: { characterId: string }) => {
  const character = await fetchCharacter(props.characterId);
  const { pawnSize: _pawnSize } = character;
  const pawnSize = _pawnSize + 1;
  await updateCharacter({
    characterId: props.characterId,
    criteria: { pawnSize },
  });
};
export const decreasePawnSize = async (props: { characterId: string }) => {
  const character = await fetchCharacter(props.characterId);
  const { pawnSize: _pawnSize } = character;
  const pawnSize = _pawnSize > 1 ? _pawnSize - 1 : 1;
  await updateCharacter({
    characterId: props.characterId,
    criteria: { pawnSize },
  });
};
