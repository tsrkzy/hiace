<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <character-switcher ref="cs"></character-switcher>
    <ha-select label="チャンネル" :items="channelItems" v-model="channelId">
      <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
    </ha-select>
    <fieldset :disabled="disableEdit">
      <legend>編集</legend>
      <div>
        <ha-textarea
          placeholder="コマンド本文"
          resizeable
          :value="text"
          @change="onChangeText($event)"
          full-width
        ></ha-textarea>
      </div>
      <div>
        <ha-input-form
          placeholder="ラベル(任意)"
          :value="label"
          @change="onChangeLabel($event)"
        ></ha-input-form>
      </div>
      <div>
        <ha-button @click="tryIt">試行</ha-button>
        <p>{{ result }}</p>
      </div>
      <div>
        <ha-checkbox label="削除する" v-model="showDeleteBtn"></ha-checkbox>
        <ha-button v-if="showDeleteBtn" @click="dropPhrase(editId)"
          >削除</ha-button
        >
      </div>
      <div>
        <details>
          <summary>ダイス履歴</summary>
          <ha-button @click="updateDiceLog">再取得</ha-button>
          <p :key="d.key" v-for="d in diceLog" class="text-selectable">
            {{ d.text }}
          </p>
        </details>
      </div>
    </fieldset>
    <ha-button @click="onCreatePhrase">新規作成</ha-button>
    <div :key="p.id" v-for="p in phraseList" class="phrase--container">
      <ha-button @click="executePhrase(p.text, p.gameSystem)">実行</ha-button>
      <ha-button v-if="!another(p.gameSystem)" @click="editPhrase(p.id)"
        >編集</ha-button
      >
      <ha-button v-if="!another(p.gameSystem)" @click="duplicatePhrase(p.id)"
        >複製</ha-button
      >
      <ha-button v-if="!another(p.gameSystem)" @click="toFront(p.id)"
        >↑</ha-button
      >
      <ha-button v-if="!another(p.gameSystem)" @click="toBack(p.id)"
        >↓</ha-button
      >
      <span :class="{ 'phrase-ok': p.ok }">({{ p.gameSystem }})&nbsp;</span>
      <span
        :class="{
          'phrase--header': true,
          'phrase--header__edit': editId === p.id
        }"
        >{{ editId === p.id ? "[編集中]" : "" }}{{ p.label || p.text }}</span
      >
    </div>
  </div>
</template>

<script>
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat } from "@/collections/Chat";
import { FSPhrase } from "@/collections/Phrase";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import { callDiceBot, dryRun, easyDiceCheck } from "@/scripts/diceBot";

export default {
  name: "ChatPallete",
  components: {
    HaCheckbox,
    CharacterSwitcher,
    HaTextarea,
    HaSelect,
    HaInputForm,
    HaButton
  },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  created() {},
  data() {
    return {
      SYSTEM_CHANNEL_ID,
      channelId: SYSTEM_CHANNEL_ID,
      editId: null,
      text: "",
      label: "",
      diceLog: [],
      result: "",
      showDeleteBtn: false
    };
  },
  computed: {
    channelItems() {
      return this.$store.getters["channel/info"].map(c => ({
        text: c.name,
        value: c.id
      }));
    },
    phraseList() {
      const gameSystem = this.$store.getters["room/gameSystem"];
      const phraseList = this.$store.getters["phrase/info"];
      return phraseList.sort((a, b) => {
        if (a.gameSystem !== gameSystem && b.gameSystem === gameSystem) {
          return 1;
        }
        if (a.gameSystem === gameSystem && b.gameSystem !== gameSystem) {
          return -1;
        }

        return a.index > b.index ? 1 : -1;
      });
    },
    phrase() {
      return this.phraseList.find(p => p.id === this.editId);
    },
    disableEdit() {
      return !this.editId;
    }
  },
  methods: {
    updateDiceLog() {
      const historyJSON = localStorage.getItem("history") || "{}";
      const history = JSON.parse(historyJSON) || [];
      this.diceLog = history;
    },
    getSpeaker() {
      /* 子コンポーネントから選択中のcharacterとaliasを取得 */
      const { aliasId, characterId } = this.$refs.cs.getIdCharacterAndAlias();
      return { aliasId, characterId };
    },
    another(gameSystem) {
      return this.$store.getters["room/gameSystem"] !== gameSystem;
    },
    async onCreatePhrase() {
      const phrase = await this.createPhrase();
      const { id } = phrase;
      this.editPhrase(id);
    },
    async createPhrase() {
      return await FSPhrase.Create({ text: "", label: "" });
    },
    async duplicatePhrase(phraseId) {
      console.log("ChatPalette.duplicatePhrase");
      const phrase = await FSPhrase.Duplicate(phraseId);
      const { id } = phrase;
      this.editPhrase(id);
    },
    async dropPhrase(phraseId) {
      console.log("ChatPalette.dropPhrase");
      this.editId = null;
      await FSPhrase.Delete(phraseId);
    },
    async toFront(phraseId) {
      const index = this.phraseList.findIndex(p => p.id === phraseId);
      if (index === 0) {
        return false;
      }
      const pA = this.phraseList[index];
      const pB = this.phraseList[index - 1];
      if (pA.gameSystem !== pB.gameSystem) {
        return false;
      }

      await FSPhrase.Swap(pA, pB);
    },
    async toBack(phraseId) {
      const index = this.phraseList.findIndex(p => p.id === phraseId);
      if (index === this.phraseList.length - 1) {
        return false;
      }
      const pA = this.phraseList[index];
      const pB = this.phraseList[index + 1];
      if (pA.gameSystem !== pB.gameSystem) {
        return false;
      }

      await FSPhrase.Swap(pA, pB);
    },
    async tryIt() {
      await this.$nextTick();
      const command = this.text;
      if (!easyDiceCheck(command)) {
        return false;
      }

      const gameSystem = this.$store.getters["room/gameSystem"];
      try {
        const { ok, result } = await callDiceBot(gameSystem, command);
        if (!ok) {
          throw new Error("not ok");
        }
        this.result = `${result}`;
      } catch (e) {
        console.error(e);
        this.result = "NG";
      }
    },
    async executePhrase(text, gameSystem) {
      const { characterId, aliasId } = this.getSpeaker();
      const { channelId } = this;

      const chatText = text.trim();
      const roomId = this.$store.getters["room/info"].id;
      const userId = this.$store.getters["auth/user"].id;
      const c = {
        room: roomId,
        channel: channelId,
        owner: userId,
        character: characterId,
        alias: aliasId,
        value: {
          text: chatText
        }
      };
      try {
        await FSChat.Chat(c, gameSystem);
      } catch (e) {
        console.error(e);
      }
    },
    editPhrase(phraseId) {
      this.editId = phraseId;
      const { label, text } = this.phrase;
      this.label = label;
      this.text = text;
      this.result = "";
      this.showDeleteBtn = false;
    },
    async onChangeText(text) {
      console.log("ChatPalette.onChangeText");
      this.text = text;
      const gameSystem = this.$store.getters["room/gameSystem"];
      const ok = await dryRun(gameSystem, text);
      await FSPhrase.Update(this.editId, { text, ok });
    },
    async onChangeLabel(label) {
      console.log("ChatPalette.onChangeLabel");
      this.label = label;
      await FSPhrase.Update(this.editId, { label });
    }
  }
};
</script>

<style lang="scss" scoped>
.phrase--text__textarea {
  width: 100%;
}
.phrase--container {
  word-break: keep-all;
  white-space: nowrap;
  //width: 300px;
  overflow-x: hidden;
}

.phrase--header {
  white-space: nowrap;
  word-break: keep-all;
  &.phrase--header__edit {
    font-weight: bold;
  }
}
.phrase-ok {
  font-weight: bold;
  color: steelblue;
}
</style>
