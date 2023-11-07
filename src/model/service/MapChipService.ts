import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { MapChip } from "../MapChip";

export const DEFAULT_MAP_IMAGE = "3xAeZFAnozZsODuCs9XC";

interface CreateMapChipProps {
  roomId: string;
  boardId: string;
  userId: string;
  imageId?: string;
  backgroundColor?: string;
  offsetX?: number;
  offsetY?: number;
  scalePp?: number;
  dragLock?: boolean;
  transform?: string;
  grid?: {
    cols: number;
    rows: number;
    color: string;
    snap: boolean;
  };
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
    dragLock = false,
    transform = `${new DOMMatrix()}`,
  } = props;
  const m = {
    room: roomId,
    board: boardId,
    owner: userId,
    image: imageId,
    backgroundColor,
    offsetX,
    offsetY,
    scalePp,
    dragLock,
    transform,
    grid: {
      cols: 15,
      rows: 15,
      color: "#000000",
      snap: true,
    },
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
    dragLock: m.dragLock,
    transform: m.transform,
    grid: m.grid,
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

export const updateMapChipTransfer = async (props: {
  mapChipId: string;
  transform: string;
}) => {
  console.log("MapChipService.updateMapChipTransfer");
  const { mapChipId, transform } = props;
  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef, mapChipId);
  await updateDoc(docRef, { transform });
};

export const updateMapChipDragLock = async (props: {
  mapChipId: string;
  dragLock: boolean;
}) => {
  console.log("MapChipService.updateMapChipDragLock");
  const { mapChipId, dragLock } = props;
  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef, mapChipId);
  await updateDoc(docRef, { dragLock });
};

export const updateMapChipScalePp = async (props: {
  mapChipId: string;
  scalePp: string;
}) => {
  console.log("MapChipService.updateMapChipScalePp");
  const { mapChipId, scalePp } = props;
  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef, mapChipId);
  await updateDoc(docRef, { scalePp });
};
