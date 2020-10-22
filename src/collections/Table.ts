import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";
import { FSColumn } from "@/collections/Column";

export class FSTable {
  static unsubscribeMap = new Map();

  static async Create(params: {
    roomId: string;
    filterColumns: string[];
    filterCharacters: string[];
  }) {
    const { roomId, filterColumns = [], filterCharacters = [] } = params;
    if (!roomId) {
      throw new Error("no roomId given");
    }
    const t = {
      room: roomId,
      filterColumns,
      filterCharacters
    };

    const db = firebase.firestore();
    const tableDocRef = await db.collection("table").add(t);
    const id = tableDocRef.id;

    return { id, ...t };
  }

  static async CreateDefault(params: { roomId: string }) {
    const { roomId } = params;
    const t = {
      roomId,
      filterColumns: [],
      filterCharacters: []
    };
    const table = await FSTable.Create(t);
    await FSColumn.CreateDefault({ roomId, tableId: table.id });
    await FSColumn.CreateDefault({ roomId, tableId: table.id });

    return table;
  }

  static async Delete(tableId: string) {
    const db = firebase.firestore();
    const docRef = db
      .collection("table")
      .doc(tableId)
      .delete();
    /* 紐づくcolumnを削除 */
    await FSColumn.DeleteByTable(tableId);

    return docRef;
  }

  static SetListener(roomId: string) {
    console.log("Table.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSTable;
    if (unsubscribeMap.has(roomId)) {
      FSTable.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("table").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const tables: any[] = [];
      querySnapshot.forEach(doc => {
        const table = doc.data();
        table.id = doc.id;
        tables.push(table);
      });
      store.dispatch("table/setTables", { tables });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSTable;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
