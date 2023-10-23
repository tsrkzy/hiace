/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useUsers } from "../../store/users";
import { User } from "../User";

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
      // setRoom(
      //   new Room({
      //     id: doc.id,
      //     name: d.name,
      //     owner: d.owner,
      //     keepers: d.keepers,
      //     requests: d.requests,
      //     kicked: d.kicked,
      //     users: d.users,
      //     gameSystem: d.gameSystem,
      //     music: d.music,
      //   }),
      // );
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };
  // const removeListener = () => {
  //   const subscribes = Array.from(subscribeMap.values());
  //   for (let i = 0; i < subscribes.length; i++) {
  //     const { id, unsubscribe } = subscribes[i];
  //     unsubscribe?.();
  //     console.log(`unsubscribed: ${id}`);
  //   }
  // };

  return { setUserListener /*removeListener*/ };
}
