/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useTables } from "../store/tables";
import { Table } from "../Table";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function TableListener() {
  const { setTables } = useTables();

  const setTableListener = (roomId: string) => {
    console.log("setTableListener");
    const q = query(collection(db, "table"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const tables: Table[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const table = new Table({
          id: doc.id,
          name: d.name,
        });
        tables.push(table);
      });
      setTables(tables);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setTableListener };
}
