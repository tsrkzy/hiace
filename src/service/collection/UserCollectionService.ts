import {
  collection,
  getDocs,
  setDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import {
  UserCollection,
  type UserCollectionProps,
} from "../../model/collection/UserCollection";

const SYSTEM_COLOR = "#000000";

export const UserCollectionService = () => {
  const fetchUserByEmail = async (
    email: string,
  ): Promise<UserCollection | null> => {
    const userRef = collection(db, "user");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      return null;
    } else if (querySnapshot.size >= 2) {
      throw new Error("user data corrupted!");
    }

    let user;
    querySnapshot.forEach(doc => {
      user = doc.data();
      user.id = doc.id;
    });
    const userProp = user as unknown as UserCollectionProps;

    return new UserCollection(userProp);
  };

  const createUser = async (props: {
    Name: string;
    PhotoUrl: string;
    Email: string;
  }): Promise<UserCollection> => {
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
    return new UserCollection({
      id,

      color: u.color,
      email: u.email,
      name: u.name,
      photoUrl: u.photoUrl,
      lastPing: u.lastPing,
      joinTo: u.joinTo,
    });
  };
  return { fetchUserByEmail, createUser };
};
