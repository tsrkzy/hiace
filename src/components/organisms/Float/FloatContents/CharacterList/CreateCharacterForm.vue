<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <ha-input-form
      v-model="characterName"
      placeholder="作成するキャラクタ名"
    ></ha-input-form>
    <ha-button
      :disabled="characterCreateButton"
      @click="onCreateMyCharacter(false)"
      >キャラクタ追加
    </ha-button>
    <ha-button
      :disabled="characterCreateButton"
      @click="onCreateMyCharacter(true)"
      >控室に追加</ha-button
    >
  </div>
</template>
<script>
import { FSCharacter } from "@/collections/Character";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import { Smoke } from "@/scripts/Smoke";

export default {
  name: "CreateCharacterForm",
  components: { HaInputForm, HaButton },
  data() {
    return {
      characterName: ""
    };
  },
  computed: {
    characterCreateButton() {
      return !this.characterName.trim();
    }
  },
  methods: {
    async onCreateMyCharacter(archived) {
      const characterName = this.characterName;
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: characterName ?? `${userName}_c${t}`,
        roomId,
        imageId: null,
        archived
      };
      await Smoke.on();
      await FSCharacter.Create(c);
      await Smoke.off();
      this.characterName = "";
    }
  }
};
</script>
