/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import store from "@/store";
import { OfferPeer } from "@/scripts/OfferPeer";
import { AnswerPeer } from "@/scripts/AnswerPeer";
import { Notify } from "@/scripts/Notify";

export const CHANNEL_NAME = "CHANNEL";
export const PeerConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    {
      urls: "turn:35.200.40.145:80?transport=udp",
      username: process.env.VUE_APP_TURN_CREDENTIAL_USER,
      credential: process.env.VUE_APP_TURN_CREDENTIAL_PASSWORD
    }
  ]
};

export const CONNECTION_DEAD = -1;
export const CREATE_OFFER_SDP = 0;
// export const SET_OFFER_LOCAL_SDP = 1;
export const WAIT_FOR_LOCAL_ICE = 2;
export const SET_ANSWER_REMOTE_SDP = 3;
// export const CREATE_ANSWER_SDP = 4;
// export const SET_ANSWER_LOCAL_SDP = 5;
export const WAIT_FOR_REMOTE_ICE = 6;
export const OFFER_SET_REMOTE_SDP = 7;
export const OFFER_SET_REMOTE_ICE = 8;
export const WAIT_FOR_CHANNEL = 9;
export const CHANNEL_ESTABLISHED = 10;

export interface NegotitationIF {
  id: string;
  offer: string;
  offerSDP: string | null;
  offerNode: string | null;
  offerICE: string | null; // candidate
  answer: string | null;
  answerSDP: string | null; // answer
  answerNode: string | null;
  answerICE: string | null; // candidate
  room: string;
  phase: number;
  createdAt: number | null;
}

export class Negotiation {
  id: string;
  offer: string;
  offerSDP: string | null;
  offerNode: string | null;
  offerICE: string | null; // candidate
  answer: string | null;
  answerSDP: string | null; // answer
  answerNode: string | null;
  answerICE: string | null; // candidate
  room: string;
  phase: number;
  createdAt: number | null;

  constructor(n: NegotitationIF) {
    this.id = n.id;
    this.offer = n.offer;
    this.offerSDP = n.offerSDP;
    this.offerNode = n.offerNode;
    this.offerICE = n.offerICE;
    this.answer = n.answer;
    this.answerSDP = n.answerSDP;
    this.answerNode = n.answerNode;
    this.answerICE = n.answerICE;
    this.room = n.room;
    this.phase = n.phase;
    this.createdAt = n.createdAt;
  }

  toPhase() {
    return this.phase;
  }
}

export const TYPING = 1;
export class PeerMessage {
  key: number;
  body: object;
  constructor(key: number, body: object) {
    this.key = key;
    this.body = body;
  }

  toJSON(): string {
    const result = {
      key: this.key,
      body: this.body
    };

    return JSON.stringify(result);
  }
}

export class Peer {
  static Map = new Map();

  static Skeleton(negotiation: Negotiation) {
    const { id, offerNode, answerNode } = negotiation;
    if (Peer.Map.has(id)) {
      /* 作成済みの場合はそれを返す */
      return Peer.Map.get(id);
    }

    const nodeId = store.getters["negotiation/node"]?.id;
    if (!nodeId) {
      throw new Error("nodeId not found");
    }

    let peer;
    if (nodeId === offerNode) {
      peer = new OfferPeer(id);
    } else if (nodeId === answerNode) {
      peer = new AnswerPeer(id);
    } else {
      /* 自分に関係しないnegotiationは来ない想定なのでErrorにする */
      throw new Error("your node is neither offer or answer");
    }

    Peer.Map.set(id, peer);

    return peer;
  }

  static GetById(negotiationId: string) {
    if (!Peer.Map.has(negotiationId)) {
      throw new Error(`no negotiation found: ${negotiationId}`);
    }
    return Peer.Map.get(negotiationId);
  }

  static Next(n: NegotitationIF) {
    const peer = Peer.GetById(n.id);
    peer.next(n);
  }

  static Send(messageJson: string) {
    const peerList = Array.from(Peer.Map.values());
    for (let i = 0; i < peerList.length; i++) {
      const peer = peerList[i];
      peer.send(messageJson);
    }
  }
}

export function onMessageHandler(json: string) {
  const jsonObj = JSON.parse(json);
  if (!jsonObj) {
    return;
  }
  const { key, body } = jsonObj;
  switch (key) {
    case TYPING: {
      const { userName, characterId } = body;
      Notify.Log(`ON TYPE: ${userName}`);
      popBalloon(characterId);
    }
  }
}

function popBalloon(characterId: string) {
  const $$s = `div.balloon-holder.alias-${characterId}`;
  const $elList = Array.from(document.querySelectorAll($$s)).filter($e => !!$e);
  const cls = "dimming";
  for (let i = 0; i < $elList.length; i++) {
    const $el = $elList[i];
    if ($el.classList.contains(cls)) {
      $el.classList.remove(cls);
    }
  }
  setTimeout(() => {
    for (let i = 0; i < $elList.length; i++) {
      const $el = $elList[i];
      $el.classList.add(cls);
    }
  }, 10);
}
