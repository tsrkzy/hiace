import { doc, getDoc } from "firebase/firestore";
import { db } from "../util/firestore";
import { Room } from "../model/Room";

export const FSRoom = () => {
  const fetchRoomByID = async (roomId: string) => {
    const docRef = doc(db, "room", roomId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const room = docSnap.data();
    room.id = docSnap.id;

    return new Room({
      id: room.id,
      name: room.name,
      owner: room.owner,
      keepers: room.keepers,
      requests: room.requests,
      kicked: room.kicked,
      users: room.users,
      characters: room.characters,
      resources: room.resources,
      gameSystem: room.gameSystem,
      maps: room.maps,
      music: room.music,
    });
  };

  return { fetchRoomByID };
};
