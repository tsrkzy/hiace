import {
  collection,
  getDocs,
  setDoc,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/util/firestore";
import { User, type UserProps } from "@/model/User";

const SYSTEM_COLOR = "#000000";

export const fetchUsersById = async (idList: string[]): Promise<User[]> => {
  return await Promise.all(idList.map(async id => await fetchUserById(id)));
};
export const fetchUserById = async (id: string): Promise<User> => {
  const collectionRef = collection(db, "user");
  const docRef = doc(collectionRef, id);
  const d = await getDoc(docRef);
  const u = d.data();
  if (!u) {
    throw new Error(`no user found: ${id}`);
  }

  return new User({
    id: docRef.id,
    color: u.color,
    email: u.email,
    name: u.name,
    photoUrl: u.photoUrl,
    lastPing: u.lastPing,
    joinTo: u.joinTo,
  });
};

export const fetchUserByEmail = async (email: string): Promise<User> => {
  const userRef = collection(db, "user");
  const q = query(userRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size === 0) {
    throw new Error(`no user found. email: ${email}`);
  } else if (querySnapshot.size >= 2) {
    throw new Error("user data corrupted!");
  }

  let user;
  querySnapshot.forEach(doc => {
    user = doc.data();
    user.id = doc.id;
  });
  const userProp = user as unknown as UserProps;

  return new User(userProp);
};

export const createUser = async (props: {
  name: string;
  photoUrl: string;
  email: string;
}): Promise<User> => {
  const u = {
    sys: { created: Date.now() },
    name: props?.name,
    photoUrl: props?.photoUrl,
    email: props?.email,
    lastPing: Date.now(),
    color: SYSTEM_COLOR,
    joinTo: [],
  };

  const collectionRef = collection(db, "user");
  const docRef = doc(collectionRef);
  await setDoc(docRef, u);

  const { id } = docRef;
  return new User({
    id,
    color: u.color,
    email: u.email,
    name: u.name,
    photoUrl: u.photoUrl,
    lastPing: u.lastPing,
    joinTo: u.joinTo,
  });
};

export const assignUserToRoom = async (userId: string, roomId: string) => {
  console.log("UserStoreService.assignUserToRoom", userId, roomId);
  const collectionRef = collection(db, "user");
  const docRef = doc(collectionRef, userId);
  const userDoc = await getDoc(docRef);
  const user = userDoc.data();

  if (!user) {
    throw new Error(`no user found: ${userId} in room: ${roomId}`);
  }

  const { joinTo = [] } = user;
  if (joinTo.indexOf(roomId) !== -1) {
    console.log("already joined");
    return;
  }
  joinTo.push(roomId);

  await updateDoc(docRef, { joinTo });
};
