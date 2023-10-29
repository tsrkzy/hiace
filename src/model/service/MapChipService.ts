import { collection, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../util/firestore";
import { MapChip } from "../MapChip";

interface CreateMapChipProps {
  roomId: string;
  boardId: string;
}

export const createMapChip = async (
  props: CreateMapChipProps,
): Promise<MapChip> => {
  const { roomId, boardId } = props;
  const m = {
    room: roomId,
    board: boardId,
  };

  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef);
  await setDoc(docRef, m);

  const { id } = docRef;
  return new MapChip({
    id,
    room: m.room,
    board: m.board,
  });
};

export const deleteMapChip = async (props: { mapChipId: string }) => {
  const { mapChipId } = props;

  const collectionRef = collection(db, "map");
  const docRef = doc(collectionRef, mapChipId);
  await deleteDoc(docRef);
};
