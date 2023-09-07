import { doc, getDoc } from "firebase/firestore"
import { db } from "../util/firestore";
import { Room } from "../model/Room";

export const FSRoom = () => {

  const fetchRoomByID = async (roomId: string) => {
    const docRef = doc(db, "room", roomId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null
    }
    const room = docSnap.data()
    room.id = docSnap.id;

    return new Room({ ...room })
  }

  return { fetchRoomByID };
};
