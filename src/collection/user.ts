import { collection, getDocs, setDoc, query, where, doc } from "firebase/firestore";
import { db } from "../util/firestore";
import { User } from "../model/User";

const SYSTEM_COLOR = "#000000"

export const FSUser = () => {
  const fetchUserByEmail = async (email: string): Promise<User|null> => {
    const userRef = collection(db, "user");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null
    }

    let user = null;
    querySnapshot.forEach(doc => {
      user = doc.data();
      user.id = doc.id;
    });

    return new User({ ...user });
  };


  const createUser = async (props: { Name: string, PhotoUrl: string, Email: string }): Promise<User|null> => {
    const u = {
      sys: { created: Date.now() },
      name: props?.Name,
      photoUrl: props?.PhotoUrl,
      email: props?.Email,
      lastPing: Date.now(),
      color: SYSTEM_COLOR,
      joinTo: [],
    };

    const collectionRef = collection(db, 'user');
    const docRef = doc(collectionRef)
    await setDoc(docRef, u)

    const { id } = docRef
    return new User({ id, ...u })
  }
  return { fetchUserByEmail, createUser };
};
