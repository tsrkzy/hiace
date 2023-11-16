/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useUsers } from "@/model/store/users";
import { User } from "@/model/User";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function UserListener() {
  const { setUsers } = useUsers();
  const setUserListener = (roomId: string) => {
    console.log("setUserListener");
    const q = query(
      collection(db, "user"),
      where("joinTo", "array-contains", roomId),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const users: User[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const user = new User({
          id: doc.id,
          name: d.name,
          color: d.color,
          email: d.email,
          joinTo: d.joinTo,
          lastPing: d.lastPing,
          photoUrl: d.photoUrl,
        });
        users.push(user);
      });
      setUsers(users);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setUserListener };
}
