import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

type INT = "int";
type STR = "str";
type BOOL = "bool";
type REF = "ref";

interface IColumn {
  label: string; //
  type: INT|STR|BOOL|REF; // // int, str, bool, ref:  !=refならstatを探しに行く、refなら参照先で表示
  refPath: string[]; //: "character.name", "owner.name" → readonly
  defaultValue?: any; //
}

export class FSTable {
  static unsubscribeMap = new Map();

  static async Create(params: {
    roomId: string;
    columns: IColumn[];
    characters: string[];
  }) {
    const { roomId, columns = [], characters = [] } = params;
    if (!roomId) {
      throw new Error("no roomId given");
    }
    const t = {
      room: roomId,
      columns,
      characters
    };

    const db = firebase.firestore();
    const tableDocRef = await db.collection("table").add(t);
    const id = tableDocRef.id;

    return { id, ...t };
  }

  static async CreateDefault(params: { roomId: string }) {
    const { roomId } = params;
    const columns: IColumn[] = [];
    const c: IColumn = {
      label: "#",
      type: "ref",
      refPath: ["character", "id"]
    };
    columns.push(c);
    const characters = store.getters["character/info"].map(
      (c: { id: string }) => c.id
    );
    const t = {
      roomId,
      columns,
      characters
    };
    await FSTable.Create(t);
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
