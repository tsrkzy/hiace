/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import {
  CHANNEL_NAME,
  Negotiation,
  CREATE_OFFER_SDP,
  SET_ANSWER_REMOTE_SDP,
  WAIT_FOR_LOCAL_ICE,
  PeerConfig,
  OFFER_SET_REMOTE_SDP,
  OFFER_SET_REMOTE_ICE,
  WAIT_FOR_CHANNEL,
  CONNECTION_DEAD,
  CHANNEL_ESTABLISHED,
  onMessageHandler
} from "@/scripts/Peer";
import { FSNegotiation } from "@/collections/Negotiation";
import { Notify } from "@/scripts/Notify";

export class OfferPeer {
  id: string;
  _connection: RTCPeerConnection | null = null;
  _channel: RTCDataChannel | null = null;
  candidates: RTCIceCandidate[] = [];
  answerSDP: RTCSessionDescription | undefined;
  offerSDP: RTCSessionDescription | undefined;

  isOpen: Boolean = false;

  get connection() {
    if (!this._connection) {
      throw new Error("connection has not created yet");
    }
    return this._connection;
  }
  set connection(c) {
    this._connection = c;
  }
  get channel() {
    if (!this._channel) {
      throw new Error("channel has not created yet");
    }
    return this._channel;
  }
  set channel(c) {
    this._channel = c;
  }

  constructor(negotiationId: string) {
    this.id = negotiationId;

    const connection = new RTCPeerConnection(PeerConfig);
    this.connection = connection;
    connection.onicecandidate = this.onicecandidate.bind(this);
    connection.oniceconnectionstatechange = this.connectionstate.bind(this);

    const channel = connection.createDataChannel(CHANNEL_NAME);
    this.channel = channel;
    channel.onmessage = this.onmessage.bind(this);
    channel.onopen = this.onopen.bind(this);
    channel.onerror = this.onerror.bind(this);
    channel.onclose = this.onclose.bind(this);
  }

  dispose() {
    console.log("OfferPeer.dispose");
    if (this.channel) {
      this.channel.onmessage = null;
      this.channel.onopen = null;
      this.channel.onerror = null;
      this.channel.onclose = null;
      this._channel = null;
    }
    if (this.connection) {
      this.connection.onicecandidate = null;
      this.connection.oniceconnectionstatechange = null;
      this._connection = null;
    }
  }

  connectionstate() {
    const state = this.connection.iceConnectionState;
    console.log(`iceState: ${state}`); // @DELETEME
    if (state === "disconnected" || state === "failed") {
      this.reconnect();
    }
  }

  async reconnect() {
    console.log("offer.reconnect"); // @DELETEME
    if (!this.offerSDP || !this.answerSDP) {
      throw new Error("cannot reconnect");
    }
    await this.setOffer(this.offerSDP);
    await this.setAnswer(this.answerSDP);
  }

  /* connection handler */
  async onicecandidate(e: RTCPeerConnectionIceEvent) {
    console.log("signal.onicecandidate"); // @DELETEME
    if (e.candidate) {
      const candidates = this.candidates;
      candidates.push(e.candidate);
    } else {
      const localICE = JSON.stringify({ candidates: this.candidates });
      await FSNegotiation.Update(this.id, {
        offerICE: localICE,
        phase: SET_ANSWER_REMOTE_SDP
      });
    }
  }

  /* phases */
  async next(n: Negotiation) {
    const phase = n.toPhase();
    console.log(`OfferPeer.next   phase -> ${phase}`); // @DELETEME
    switch (phase) {
      case CREATE_OFFER_SDP: {
        const localSDP = await this.createOffer();
        await this.setOffer(localSDP);
        const offerSDP = JSON.stringify(localSDP);
        await FSNegotiation.Update(n.id, {
          offerSDP,
          offerICE: null,
          answerSDP: null,
          answerICE: null,
          phase: WAIT_FOR_LOCAL_ICE
        });
        break;
      }
      case OFFER_SET_REMOTE_SDP: {
        const remoteSDP = JSON.parse(n.answerSDP ?? "");
        await this.setAnswer(remoteSDP);
        await FSNegotiation.Update(n.id, { phase: OFFER_SET_REMOTE_ICE });
        break;
      }
      case OFFER_SET_REMOTE_ICE: {
        const remoteICE = JSON.parse(n.answerICE ?? "");
        if (!remoteICE) {
          throw new Error("invalid remoteICE");
        }
        await this.setOpponentIceCandidates(remoteICE.candidates);
        await FSNegotiation.Update(n.id, { phase: WAIT_FOR_CHANNEL });
        break;
      }
    }
  }

  /* channel handler */
  onmessage(e: MessageEvent) {
    console.log("onmessage", e.data);
    onMessageHandler(e.data);
  }
  onopen() {
    console.log("onopen");
    this.isOpen = true;
    FSNegotiation.Update(this.id, { phase: CHANNEL_ESTABLISHED });
    Notify.Log(`WebRTC: established - (${this.id})`);
  }
  onerror() {
    console.log("onerror");
  }
  onclose() {
    console.log("onclose");
    this.dispose();
    FSNegotiation.Update(this.id, { phase: CONNECTION_DEAD });
  }
  async createOffer(): Promise<RTCSessionDescription> {
    const offerSDP = await this.connection.createOffer();
    return new RTCSessionDescription(offerSDP);
  }

  async setOffer(offerSDP: RTCSessionDescription) {
    this.offerSDP = offerSDP;
    await this.connection.setLocalDescription(offerSDP);
  }

  async setAnswer(answerSDP: RTCSessionDescription) {
    this.answerSDP = answerSDP;
    try {
      await this.connection.setRemoteDescription(answerSDP);
    } catch (e) {
      console.error(e); // @DELETEME
    }
  }

  getCandidatesJSON() {
    return JSON.stringify({ candidates: this.candidates });
  }

  async setOpponentIceCandidates(candidates: RTCIceCandidateInit[]) {
    return Promise.all(
      candidates.map(candidate => {
        return this.connection.addIceCandidate(candidate);
      })
    ).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  }

  send(messageJson: string) {
    if (!this.isOpen) {
      return;
    }

    if (!this.channel) {
      console.warn("channel has not created yet"); // @DELETEME
      return false;
    }

    this.channel.send(messageJson);
  }

  ping() {
    this.send("ping");
  }
}
