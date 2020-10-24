import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export const INT = "int";
export const STR = "str";
export const BOOL = "bool";
export const REF = "ref";

export class FSColumn {
  static unsubscribeMap = new Map();

  static async Create(params: {
    roomId: string;
    tableId: string;
    label: string;
    dataType: string;
    refPath: string;
    dataMap: object;
  }) {
    const {
      roomId,
      tableId,
      label = "",
      dataType,
      refPath,
      dataMap = {}
    } = params;

    if (!roomId) {
      throw new Error("no roomId given");
    }
    if (!tableId) {
      throw new Error("no tableId given");
    }

    const c = {
      room: roomId,
      table: tableId,
      label,
      dataType,
      refPath,
      dataMap
    };

    const db = firebase.firestore();
    const columnDocRef = await db.collection("column").add(c);
    const id = columnDocRef.id;

    return { id, ...c };
  }

  static async CreateDefault(params: { roomId: string; tableId: string }) {
    const { roomId, tableId } = params;
    const c = {
      roomId,
      tableId,
      label: "#",
      dataType: REF,
      refPath: "character.id",
      dataMap: {}
    };
    return await FSColumn.Create(c);
  }

  static async Delete(columnId: string) {
    const db = firebase.firestore();
    return await db
      .collection("column")
      .doc(columnId)
      .delete();
  }

  static async DeleteByTable(tableId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("column")
      .where("table", "==", tableId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId: string) {
    console.log("Column.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSColumn;
    if (unsubscribeMap.has(roomId)) {
      FSColumn.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("column").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const columns: any[] = [];
      querySnapshot.forEach(doc => {
        const column = doc.data();
        column.id = doc.id;
        columns.push(column);
      });
      store.dispatch("column/setColumns", { columns });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSColumn;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
