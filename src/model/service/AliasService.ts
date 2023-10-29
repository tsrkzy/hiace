import { setDoc, doc, collection } from "firebase/firestore";
import { Alias } from "../Alias";
import { db } from "../../util/firestore";

const DEFAULT_CHARACTER_IMAGE = "default_character_image";

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
  imageId: string;
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
