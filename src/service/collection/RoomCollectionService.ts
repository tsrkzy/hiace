import { doc, getDoc, collection, setDoc,updateDoc } from "firebase/firestore";
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
    GameSystem: string;
  }): Promise<RoomCollection> => {
    const r = {
      name: props.Name,
      owner: props.Owner,
      keepers: [props.Owner],
      requests: [],
      kicked: [],
      users: [props.Owner],
      gameSystem: props.GameSystem,
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

  const setRoomStateForUser = async (props: {
    RoomId: string;
    UserId: string;
    State: string;
  }): Promise<RoomCollection> => {
    const {
      RoomId: roomId,
      UserId: userId,
      State: state
    } = props;

    const docRef = doc(db, "room", roomId)
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`no room found: ${roomId}`)
    }

    const room = docSnap.data();
    room.requests = room.requests.filter(u => u !== userId);
    room.kicked = room.kicked.filter(u => u !== userId);
    room.users = room.users.filter(u => u !== userId);
    switch (state) {
      case "KICKED":
        room.kicked.push(userId)
        break;

      case "JOINED":
        room.users.push(userId)
        break;

      case "WAITING":
        room.requests.push(userId)
        break;

      case "NO_REQUEST":
        break;
    }

    const roomDoc = doc(db,"room", roomId);
    await updateDoc(roomDoc, {
      requests: room.requests,
      kicked: room.kicked,
      users: room.users,
    })

    return new RoomCollection({
        id: docRef.id,
        name: room.name,
        owner: room.owner,
        keepers: room.keepers,
        requests: room.requests,
        kicked: room.kicked,
        users: room.users,
        gameSystem: room.gameSystem,
        music: room.music,
      }
    )
  }

  return { fetchRoomByID, createRoom, setRoomStateForUser };
};
