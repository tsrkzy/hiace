import { doc, getDoc, collection, setDoc } from "firebase/firestore";
import { db } from "../../util/firestore";
import { RoomCollection } from "../../model/collection/RoomCollection";

export const RoomCollectionService = () => {
  const fetchRoomByID = async (roomId: string) => {
    const docRef = doc(db, "room", roomId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const room = docSnap.data();
    room.id = docSnap.id;

    return new RoomCollection({
      id: room.id,
      name: room.name,
      owner: room.owner,
      keepers: room.keepers,
      requests: room.requests,
      kicked: room.kicked,
      users: room.users,
      gameSystem: room.gameSystem,
      music: room.music,
    });
  };

  const createRoom = async (props: {
    Name: string;
    Owner: string;
    gameSystem: string;
  }): Promise<RoomCollection> => {
    const r = {
      name: props.Name,
      owner: props.Owner,
      keepers: [props.Owner],
      requests: [],
      kicked: [],
      users: [props.Owner],
      gameSystem: props.gameSystem,
      music: "",
    };

    const collectionRef = collection(db, "room");
    const docRef = doc(collectionRef);
    await setDoc(docRef, r);

    const { id } = docRef;
    return new RoomCollection({
      id,
      name: r.name,
      owner: r.owner,
      keepers: r.keepers,
      requests: r.requests,
      kicked: r.kicked,
      users: r.users,
      gameSystem: r.gameSystem,
      music: "",
    });
  };

  return { fetchRoomByID, createRoom };
};
