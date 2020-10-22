import Vue from "vue";
import Vuex from "vuex";

import { auth } from "@/store/auth";
import { room } from "@/store/room";
import { image } from "@/store/image";
import { user } from "@/store/user";
import { chat } from "@/store/chat";
import { channel } from "@/store/channel";
import { character } from "@/store/character";
import { alias } from "@/store/alias";
import { board } from "@/store/board";
import { map } from "@/store/map";
import { pawn } from "@/store/pawn";
import { table } from "@/store/table";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    room,
    image,
    user,
    chat,
    channel,
    character,
    alias,
    board,
    map,
    pawn,
    table
  }
});
