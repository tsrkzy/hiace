<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <fieldset>
    <legend>RTC</legend>
    <!--    <p>{{ tabs }}</p>-->
    <table>
      <thead>
        <tr>
          <th>o/a</th>
          <th>@</th>
          <th>t</th>
          <th>oSDP</th>
          <th>aSDP</th>
          <th>oICE</th>
          <th>aICE</th>
          <th>phase</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="n.id" v-for="n in negotiations" :data-key="n.id">
          <td>
            {{
              n.offerNode === node.id
                ? "offer"
                : n.answerNode === node.id
                ? "answer"
                : "-"
            }}
          </td>
          <td class="center">
            {{ n.offerNode === node.id ? getName(n.answer) : getName(n.offer) }}
          </td>
          <td class="center">{{ new Date(n.createdAt).toLocaleString() }}</td>
          <td class="center">{{ n.offerSDP ? "o" : "x" }}</td>
          <td class="center">{{ n.answerSDP ? "o" : "x" }}</td>
          <td class="center">{{ n.offerICE ? "o" : "x" }}</td>
          <td class="center">{{ n.answerICE ? "o" : "x" }}</td>
          <td class="center">
            {{ n.phase }}{{ n.phase === 10 ? "(ok)" : "/10" }}
          </td>
        </tr>
      </tbody>
    </table>
  </fieldset>
</template>
<script>
import { getName } from "@/scripts/helper";
import { Peer } from "@/scripts/Peer";

window.p = Peer;

export default {
  name: "RtcStatus",
  computed: {
    me() {
      return this.$store.getters["auth/user"].id;
    },
    tabs() {
      return this.$store.getters["room/tabs"];
    },
    node() {
      return this.$store.getters["negotiation/node"];
    },
    negotiations() {
      const nodeId = this.node?.id;
      return this.$store.getters["negotiation/info"]
        .filter(n => n.offerNode === nodeId || n.answerNode === nodeId)
        .sort((a, b) => {
          return a.phase < b.phase ? 1 : -1;
        });
    }
  },
  methods: {
    getName(userId) {
      return getName("user", userId);
    }
  }
};
</script>
<style lang="scss" scoped>
table {
  tr {
    td {
      &.center {
        text-align: center;
      }
    }
  }
}
</style>
