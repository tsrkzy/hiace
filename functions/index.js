const { https, logger, firestore } = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

async function addNodeDocument(room, owner, sdp) {
  const createdAt = Date.now();
  const writeResult = await admin
    .firestore()
    .collection("node")
    .add({ room, owner, createdAt });

  const dataRef = await writeResult.get();
  const d = await dataRef.data();
  return { writeResult, d };
}

exports.addNode = https.onRequest(async (req, res) => {
  const { room, owner } = res.query;
  logger.log(`room: ${room}, owner: ${owner}`);
  const { writeResult, d } = await addNodeDocument(room, owner);

  res.json({
    result: {
      id: writeResult.id,
      room: d.room,
      owner: d.owner,
      createdAt: d.createdAt
    }
  });
});

exports.addNodeCallee = https.onCall(async (data, context) => {
  const { room, owner } = data;
  logger.log(`room: ${room}, owner: ${owner}`);
  const { writeResult, d } = await addNodeDocument(room, owner);
  return {
    node: {
      id: writeResult.id,
      room: d.room,
      owner: d.owner,
      createdAt: d.createdAt
    }
  };
});

exports.createNegotiationMesh = firestore
  .document("/node/{nodeId}")
  .onCreate(async (snap, context) => {
    const { room, owner, createdAt } = await snap.data();
    const { nodeId } = context.params;
    logger.log(`room: ${room},owner: ${owner},createdAt: ${createdAt}`);

    const nodeList = await fetchNodeList(room, owner);
    const negotiationList = await fetchNegotiationList(room);

    const keyList = negotiationList.map(n => [
      `o:${n.offerNode}_a:${n.answerNode}`,
      n.id
    ]);
    const keyMap = new Map(keyList);

    /* negotiation mesh の対象になるnodeについて、その寿命 */
    const nodeLifeMs = 1000 * 60 * 60 * 1;
    const H24Before = Date.now() - nodeLifeMs;

    const negotiations = [];

    const nA = {
      id: nodeId,
      room,
      owner,
      createdAt
    };

    for (let j = 0; j < nodeList.length; j++) {
      const nB = nodeList[j];
      /* 24時間以上経過したnodeは無視 */
      if (nB.createdAt < H24Before) {
        continue;
      }

      /* 同じgoogleIDは無視 */
      if (nA.owner === nB.owner) {
        continue;
      }

      /* 後に作成されたほうがoffer */
      const o = nA.createdAt > nB.createdAt ? nA : nB;
      const a = nA.createdAt >= nB.createdAt ? nB : nA;

      /* 既に存在する場合は無視 */
      if (keyMap.has(`o:${o.id}_a:${a.id}`)) {
        continue;
      }

      negotiations.push({
        offer: o.owner,
        offerNode: o.id,
        offerSDP: null,
        offerICE: null,
        answer: a.owner,
        answerNode: a.id,
        answerSDP: null,
        answerICE: null,
        room,
        phase: 0,
        createdAt: Date.now()
      });
    }

    const db = admin.firestore();
    const pAll = [];
    for (let i = 0; i < negotiations.length; i++) {
      let n = negotiations[i];
      pAll.push(db.collection("negotiation").add(n));
    }

    await Promise.all(pAll);

    return {
      room,
      owner,
      createdAt,
      negotiations
    };
  });

async function fetchNodeList(room, owner) {
  const nodeSnapshot = await admin
    .firestore()
    .collection("node")
    .where("room", "==", room)
    .where("owner", "!=", owner);

  const nodes = await nodeSnapshot.get();
  const pAll = [];
  for (let i = 0; i < nodes.docs.length; i++) {
    let node = nodes.docs[i];
    pAll.push(
      new Promise(async resolve => {
        const n = await node.data();
        n.id = node.id;
        resolve(n);
      })
    );
  }

  return await Promise.all(pAll);
}

async function fetchNegotiationList(room) {
  const negotiationSnapshot = await admin
    .firestore()
    .collection("negotiation")
    .where("room", "==", room);

  const negotiations = await negotiationSnapshot.get();

  const pAll = [];
  for (let i = 0; i < negotiations.docs.length; i++) {
    let negotiation = negotiations.docs[i];
    pAll.push(
      new Promise(async resolve => {
        const n = await negotiation.data();
        n.id = negotiation.id;
        resolve(n);
      })
    );
  }

  return await Promise.all(pAll);
}
