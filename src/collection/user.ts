import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../util/firestore";
import { User } from "../model/User";

export const FSUser = () => {
  const fetchUserByEmail = async (email: string): Promise<User | null> => {
    const userRef = collection(db, "user");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let user = null;
    querySnapshot.forEach(doc => {
      user = doc.data();
      user.id = doc.id;
    });

    return user;
  };

  return { fetchUserByEmail };
};
