import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export const INT = "int";
export const STR = "str";
export const BOOL = "bool";
export const REF = "ref";

export class FSColumn {
  static unsubscribeMap = new Map();

  static async GetById({
    id
  }: {
    id: string;
  }): Promise<{
    id: string;
    room: string;
    table: string;
    label: string;
    show: boolean;
    dataType: string;
    refPath: string;
    dataMap: object;
    order: number;
  } | null> {
    const db = firebase.firestore();
    const docRef = await db
      .collection("column")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const column = docRef.data();

    return {
      id,
      room: column?.room,
      table: column?.table,
      label: column?.label,
      show: column?.show,
      dataType: column?.dataType,
      refPath: column?.refPath,
      dataMap: column?.dataMap ?? {},
      order: column?.order ?? 0
    };
  }

  static async Create(params: {
    roomId: string;
    tableId: string;
    label: string;
    show: boolean;
    dataType: string;
    refPath: string;
    dataMap: object;
  }) {
    const {
      roomId,
      tableId,
      label = "",
      show = true,
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

    const columns = store.getters["column/info"]
      .filter((c: { table: string }) => c.table === tableId)
      .sort((a: { order: number }, b: { order: number }) =>
        a.order < b.order ? 1 : -1
      );
    const order = columns.length === 0 ? 0 : (columns[0].order ?? 0) + 1;

    const c = {
      room: roomId,
      table: tableId,
      label,
      show,
      dataType,
      refPath,
      dataMap,
      order
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
      show: true,
      dataType: REF,
      refPath: "character.id",
      dataMap: {}
    };
    return await FSColumn.Create(c);
  }

  static async Update(columnId: string, criteria: object) {
    const db = firebase.firestore();
    const doc = db.collection("column").doc(columnId);
    return await doc.update(criteria);
  }

  static async UpdateDataMap(
    columnId: string,
    updates: { characterId: string; value: any }[]
  ) {
    const column = await FSColumn.GetById({ id: columnId });
    const dataMap: { [key: string]: any } = column?.dataMap ?? {};
    for (let i = 0; i < updates.length; i++) {
      const { characterId, value } = updates[i];
      dataMap[characterId] = value;
      console.log("Column.UpdateDataMap", columnId, characterId, value); // @DELETEME
    }

    const db = firebase.firestore();
    await db
      .collection("column")
      .doc(columnId)
      .update({ dataMap });
  }

  static async Reorder(tableId: string, columnId: string, order: number) {
    const columns = store.getters["column/info"]
      .filter((c: { table: string }) => c.table === tableId)
      .sort((a: { order: number }, b: { order: number }) =>
        a.order > b.order ? 1 : -1
      );
    if (columns.length <= 1) {
      console.log("columns.length too short for re-order");
      return false;
    }

    const index = columns.findIndex((c: { id: string }) => c.id === columnId);

    if (order > 0 && index === columns.length - 1) {
      console.log(`column is already on tail: ${columnId}`);
      return false;
    } else if (order < 0 && index === 0) {
      console.log(`column is already on head: ${columnId}`);
      return false;
    }

    const o = order > 0 ? 1 : -1;
    const c = columns[index + o];
    if (!c) {
      console.log(columns); // @DELETEME
      throw new Error("implement error");
    }
    return await FSColumn.Swap(columnId, c.order, c.id, c.order - o);
  }

  static async Swap(aId: string, aOrder: number, bId: string, bOrder: number) {
    const db = firebase.firestore();
    const batch = db.batch();
    const aRef = db.collection("column").doc(aId);
    const bRef = db.collection("column").doc(bId);
    batch.update(aRef, { order: aOrder });
    batch.update(bRef, { order: bOrder });
    return await batch.commit();
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
