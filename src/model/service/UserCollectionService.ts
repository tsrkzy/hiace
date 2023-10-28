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
import { db } from "../../util/firestore";
import { User, type UserProps } from "../User";

const SYSTEM_COLOR = "#000000";

export const UserCollectionService = () => {
  const fetchUserByEmail = async (email: string): Promise<User> => {
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

  const createUser = async (props: {
    Name: string;
    PhotoUrl: string;
    Email: string;
  }): Promise<User> => {
    const u = {
      sys: { created: Date.now() },
      name: props?.Name,
      photoUrl: props?.PhotoUrl,
      email: props?.Email,
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

  const joinRoom = async (userId: string, roomId: string) => {
    console.log("UserStoreService.joinRoom", userId, roomId);
    const userDocRef = doc(db, userId);
    const userDoc = await getDoc(userDocRef);
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

    await updateDoc(userDocRef, { joinTo });
  };

  return { fetchUserByEmail, createUser, joinRoom };
};
