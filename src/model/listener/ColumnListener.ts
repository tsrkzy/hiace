/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useColumns } from "../store/columns";
import { Column } from "../Column";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ColumnListener() {
  const { setColumns } = useColumns();

  const setColumnListener = (roomId: string) => {
    console.log("setColumnListener");
    const q = query(collection(db, "column"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const columns: Column[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const column = new Column({
          id: doc.id,
          name: d.name,
        });
        columns.push(column);
      });
      setColumns(columns);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setColumnListener };
}
