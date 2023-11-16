import {
  setDoc,
  doc,
  collection,
  writeBatch,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Alias } from "@/model/Alias";
import { db } from "@/util/firestore";

const DEFAULT_CHARACTER_IMAGE = "default_character_image";

export const fetchAliasById = async ({
  id,
}: {
  id: string;
}): Promise<Alias | null> => {
  const docRef = doc(collection(db, "alias"), id);
  const d = await getDoc(docRef);
  if (!d.exists()) {
    return null;
  }

  const data = d.data();
  return new Alias({
    id,
    name: data.name,
    room: data.room,
    image: data.image,
    character: "",
  });
};

interface CreateDefaultAliasProps {
  roomId: string;
  characterId: string;
  imageId: string;
}

export const createDefaultAlias = async (
  props: CreateDefaultAliasProps,
): Promise<Alias> => {
  const { roomId, characterId, imageId } = props;
  const name = "基本";
  return await createAlias({
    roomId,
    characterId,
    imageId,
    name,
  });
};

interface CreateAliasProps {
  roomId: string;
  characterId: string;
  imageId?: string;
  name: string;
}

export const createAlias = async (props: CreateAliasProps): Promise<Alias> => {
  const {
    roomId: room,
    characterId: character,
    imageId: image = DEFAULT_CHARACTER_IMAGE,
    name,
  } = props;

  const a = {
    room,
    character,
    image,
    name,
  };
  const collectionRef = collection(db, "alias");
  const docRef = doc(collectionRef);
  await setDoc(docRef, a);
  const { id } = docRef;

  return new Alias({
    id,
    room: a.room,
    character: a.character,
    image: a.image,
    name: a.name,
  });
};

export const deleteAlias = async (props: {
  aliasId: string;
}): Promise<void> => {
  const { aliasId } = props;
  console.log("AliasService.deleteAlias", aliasId);
  const docRef = doc(collection(db, "alias"), aliasId);
  await deleteDoc(docRef);
};

interface DeleteAliasesByCharacterProps {
  characterId: string;
}

export const deleteAliasesByCharacter = async (
  props: DeleteAliasesByCharacterProps,
): Promise<void> => {
  const { characterId } = props;

  const batch = writeBatch(db);
  const collectionRef = collection(db, "alias");

  const q = query(collectionRef, where("character", "==", characterId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(d => batch.delete(d.ref));

  await batch.commit();
};

interface UpdateAliasProps {
  aliasId: string;
  criteria: object;
}

export const updateAlias = async (props: UpdateAliasProps): Promise<void> => {
  const { aliasId, criteria } = props;
  const collectionRef = collection(db, "alias");
  const docRef = doc(collectionRef, aliasId);
  return await updateDoc(docRef, criteria);
};
