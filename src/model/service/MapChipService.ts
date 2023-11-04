import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { MapChip } from "../MapChip";

export const DEFAULT_MAP_IMAGE = "3xAeZFAnozZsODuCs9XC";

// export const DEFAULT_CHARACTER_IMAGE = "wG5tOfKAW3trnsApUNRy";

interface CreateMapChipProps {
  roomId: string;
  boardId: string;
  userId: string;
  imageId?: string;
  backgroundColor?: string;
  offsetX?: number;
  offsetY?: number;
  scalePp?: number;
}

export const createMapChip = async (
  props: CreateMapChipProps,
): Promise<MapChip> => {
  const {
    roomId,
    boardId,
    userId,
    imageId = DEFAULT_MAP_IMAGE,
    backgroundColor = "#000000",
    offsetX = 0,
    offsetY = 0,
    scalePp = 100,
  } = props;
  const m = {
    room: roomId,
    board: boardId,
    owner: userId,
    image: imageId,
    backgroundColor: backgroundColor,
    offsetX: offsetX,
    offsetY: offsetY,
    scalePp: scalePp,
  };

  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef);
  await setDoc(docRef, m);

  const { id } = docRef;
  return new MapChip({
    id,
    room: m.room,
    board: m.board,
    owner: m.owner,
    image: m.image,
    backgroundColor: m.backgroundColor,
    offsetX: m.offsetX,
    offsetY: m.offsetY,
    scalePp: m.scalePp,
  });
};

export const deleteMapChip = async (props: { mapChipId: string }) => {
  const { mapChipId } = props;

  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef, mapChipId);
  await deleteDoc(docRef);
};

export const deleteMapChipByBoard = async (props: { boardId: string }) => {
  const { boardId } = props;

  const batch = writeBatch(db);
  const collectionRef = collection(db, "map");

  const q = query(collectionRef, where("board", "==", boardId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(d => batch.delete(d.ref));

  await batch.commit();
};
