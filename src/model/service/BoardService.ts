import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Board } from "../Board";

export const createBoard = async (props: {
  roomId: string;
}): Promise<Board> => {
  const { roomId } = props;
  const b = {
    room: roomId,
  };

  const collectionRef = collection(db, "board");
  const docRef = doc(collectionRef);
  await setDoc(docRef, b);

  const { id } = docRef;
  return new Board({
    id,
    room: b.room,
  });
};
