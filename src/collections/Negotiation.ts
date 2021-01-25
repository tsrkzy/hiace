import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import { Negotiation, Peer } from "@/scripts/Peer";

export class FSNegotiation {
  static unsubscribeMap = new Map();

  static async Update(negotiationId: string, criteria: object) {
    const db = firebase.firestore();
    const docRef = await db.collection("negotiation").doc(negotiationId);
    return await docRef.update(criteria);
  }

  /**
   * 自分の接続(node)を作成。
   * onCreateのtriggerを誘発し、negotiationを作成する
   * @param room {string}
   * @param owner {string}
   * @constructor
   */
  static async AddNode(room: string, owner: string) {
    const addNode = firebase.functions().httpsCallable("addNodeCallee");
    console.warn("Negotiation.Skeleton", room, owner); // @DELETEME
    const { data } = await addNode({ room, owner });
    const { node } = data;
    await store.dispatch("negotiation/setNode", { node });
    return node;
  }

  static SetListener(roomId: string) {
    console.log("Note.SetListener"); // @DELETEME
    FSNegotiation.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("negotiation").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const nodeId = store.getters["negotiation/node"]?.id;
      if (!nodeId) {
        /* node未作成の場合はすべて無視(無関係) */
        console.warn("nodeId has not created yet.");
        return;
      }
      /* 自分のnodeに対応するnegotiationは、onCreateで作られるので
       * ここでハンドル */
      const changes = querySnapshot.docChanges();
      const addNegotiations = [];
      for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const nData = change.doc.data();
        nData.id = change.doc.id;
        const n = new Negotiation({
          id: change.doc.id,
          offer: nData.offer,
          offerNode: nData.offerNode,
          offerSDP: nData.offerSDP,
          offerICE: nData.offerICE,
          answer: nData.answer,
          answerNode: nData.answerNode,
          answerSDP: nData.answerSDP,
          answerICE: nData.answerICE,
          room: nData.room,
          phase: nData.phase,
          createdAt: nData.createdAt
        });

        if (n.offerNode !== nodeId && n.answerNode !== nodeId) {
          continue;
        }
        const { type } = change;
        if (type === "added") {
          /* 自分のログインによってトリガが作成した、自分がofferのnegotiation。OfferPeerを作成する */
          Peer.Skeleton(n);
          Peer.Next(n);
          addNegotiations.push(n);
        } else if (type === "modified") {
          store.dispatch("negotiation/updateNegotiation", { negotiation: n });
          Peer.Next(n);
        } else {
          console.warn(`negotiation removed: ${n.id}`, n); // @DELETEME
        }
      }
      if (addNegotiations.length !== 0) {
        store.dispatch("negotiation/addNegotiations", { addNegotiations });
      }
    });

    const { unsubscribeMap } = FSNegotiation;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Note.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSNegotiation;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
