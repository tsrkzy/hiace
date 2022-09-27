import Vue from "vue";
import Vuex from "vuex";

import { auth } from "@/store/auth";
import { room } from "@/store/room";
import { image } from "@/store/image";
import { sound } from "@/store/sound";
import { user } from "@/store/user";
import { chat } from "@/store/chat";
import { channel } from "@/store/channel";
import { character } from "@/store/character";
import { alias } from "@/store/alias";
import { board } from "@/store/board";
import { map } from "@/store/map";
import { pawn } from "@/store/pawn";
import { arrow } from "@/store/arrow";
import { dice } from "@/store/dice";
import { table } from "@/store/table";
import { column } from "@/store/column";
import { note } from "@/store/note";
import { phrase } from "@/store/phrase";
import { notice } from "@/store/notice";
import { smoke } from "@/store/smoke";
import { contextmenu } from "@/store/contextmenu";
import { float } from "@/store/float";
import { detail } from "@/store/detail";
import { localConfig } from "@/store/localConfig";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    room,
    image,
    sound,
    user,
    chat,
    channel,
    character,
    alias,
    board,
    map,
    pawn,
    arrow,
    dice,
    table,
    column,
    note,
    phrase,
    notice,
    smoke,
    contextmenu,
    float,
    detail,
    localConfig,
  },
});
