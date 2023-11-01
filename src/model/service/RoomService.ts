import { doc, getDoc, collection, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Room } from "../Room";

export const fetchRoomByID = async (roomId: string): Promise<Room> => {
  const collectionRef = collection(db, "room");
  const docRef = doc(collectionRef, roomId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`room does not found: ${roomId}`);
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
    gameSystem: room.gameSystem,
    music: room.music,
  });
};

export const createRoom = async (props: {
  Name: string;
  Owner: string;
  GameSystem: string;
}): Promise<Room> => {
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
  return new Room({
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

export const setRoomStateForUser = async (props: {
  RoomId: string;
  UserId: string;
  State: string;
}): Promise<Room> => {
  const { RoomId: roomId, UserId: userId, State: state } = props;

  const docRef = doc(db, "room", roomId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`no room found: ${roomId}`);
  }

  const room = docSnap.data();
  room.requests = room.requests.filter((u: string) => u !== userId);
  room.kicked = room.kicked.filter((u: string) => u !== userId);
  room.users = room.users.filter((u: string) => u !== userId);
  switch (state) {
    case "KICKED":
      room.kicked.push(userId);
      break;

    case "JOINED":
      room.users.push(userId);
      break;

    case "WAITING":
      room.requests.push(userId);
      break;

    case "NO_REQUEST":
      break;
  }

  const roomDoc = doc(db, "room", roomId);
  await updateDoc(roomDoc, {
    requests: room.requests,
    kicked: room.kicked,
    users: room.users,
  });

  return new Room({
    id: docRef.id,
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

export const joinRoom = async (userId: string, roomId: string) => {
  console.log("RoomService.joinRoom");
  const room = await fetchRoomByID(roomId);
  if (room.requests.indexOf(userId) === -1) {
    throw new Error(`no request in room: ${roomId}, user: ${userId}`);
  }

  if (room.users.indexOf(userId) !== -1) {
    console.log(`user: ${userId} already in room: ${roomId}`);
    return false;
  }

  /* 入室申請ユーザから取り除き、入室済みユーザに追加 */
  room.requests = room.requests.filter(uId => uId !== userId);
  room.users.push(userId);

  const collectionRef = collection(db, "room");
  const docRef = doc(collectionRef, roomId);
  await updateDoc(docRef, {
    requests: room.requests,
    users: room.users,
  });
};
