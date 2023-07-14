<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <ha-select
      :value="characterId"
      :items="characterItemList"
      mandatory
      @change="onCharacterChange"
    ></ha-select>
    <fieldset>
      <legend>キャラクタの設定</legend>
      <div>
        <ha-input-form
          label="名前"
          :value="character['name']"
          @change="onCharacterNameInput"
        ></ha-input-form>
      </div>
      <div>
        <ha-textarea
          class="character-edit__textarea-wrapper"
          rows="3"
          :value="character['text']"
          placeholder="キャラクタ説明"
          @change="onCharacterTextInput"
          resizeable
        ></ha-textarea>
      </div>
      <div>
        <ha-checkbox
          label="データテーブルに表示する"
          :value="showOnInitiative"
          @change="onCharacterShowOnInitiative"
        ></ha-checkbox>
      </div>
      <div>
        <color-picker :chat-color="chatColor" @change="onChangeColor" />
      </div>
      <div>
        <ha-select
          label="コマの大きさ"
          :items="pawnSizeItems"
          v-model="pawnSizeStr"
          @change="onChangePawnSize"
        >
          <option disabled :value="null">select pawn size</option>
        </ha-select>
      </div>
      <ha-checkbox
        v-if="myCharacter"
        v-model="characterDeleteMode"
        label="キャラクタを完全に削除する"
      ></ha-checkbox>
      <ha-button v-if="characterDeleteMode" @click="onDeleteCharacter"
        >キャラクタを削除</ha-button
      >
    </fieldset>
    <fieldset>
      <legend>立ち絵</legend>
      <div>
        <label>
          <span>表示位置</span>
          <input
            type="range"
            min="0"
            max="11"
            step="1"
            :value="chatPosition"
            @change="onChangePosition"
          />
        </label>
      </div>
      <div>
        <ha-button @click="onCreateAlias">立ち絵の追加</ha-button>
      </div>
      <ul style="padding-left: 0; margin: 0">
        <li v-for="a in aliases" :key="a.id">
          <ha-input-form
            :value="a.name"
            @change="onAliasNameChange(a.id, $event)"
          ></ha-input-form>
          <ha-button
            v-if="aliasDeleteMode && aliases.length > 1"
            @click="onDeleteAlias(a.id, $event)"
            >削除</ha-button
          >
        </li>
      </ul>
      <ha-checkbox
        v-if="myCharacter && aliases.length > 1"
        v-model="aliasDeleteMode"
        label="立ち絵を完全に削除する"
      ></ha-checkbox>
    </fieldset>
    <fieldset>
      <legend>画像の割り当て</legend>
      <div>
        <ha-select
          v-model="aliasId"
          :items="aliasItems"
          mandatory
          @change="onChangeAlias"
        >
          <option :value="null" selected disabled>割り当て先の立ち絵</option>
        </ha-select>
      </div>
      <div>
        <img
          v-if="aliasId"
          :src="srcUrl"
          :alt="imgAlt"
          style="max-width: 128px; max-height: 128px"
        />
        <span v-else>立ち絵を選択してください</span>
      </div>
      <scroll-summary>
        <image-show-case
          :disabled="!aliasId"
          nav-to-image-manager
          show-null
          :image-id="imageId"
          @selectImage="onAliasImageChange"
        ></image-show-case>
      </scroll-summary>
    </fieldset>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { SYSTEM_COLOR } from "@/collections/Chat";
import { FSImage } from "@/collections/Image";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import ImageShowCase from "@/components/molecules/ImageShowCase";
import ColorPicker from "@/components/molecules/ColorPicker";
import ScrollSummary from "@/components/atoms/ScrollSummary";
import { washExcelNastyText } from "@/scripts/helper";
import { Smoke } from "@/scripts/Smoke";

const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export default {
  name: "CharacterEdit",
  components: {
    HaButton,
    ColorPicker,
    ScrollSummary,
    HaCheckbox,
    HaSelect,
    ImageShowCase,
    HaTextarea,
    HaInputForm,
  },
  props: {
    floatId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      characterId: null,
      imageId: null,
      aliasId: null,
      srcUrl: null,
      imgAlt: null,
      chatPosition: "0",
      pawnSizeStr: "1",
      chatColor: SYSTEM_COLOR,
      characterDeleteMode: false,
      aliasDeleteMode: false,
    };
  },
  async created() {
    const float = this.$store.getters["float/info"].find(
      (f) => f.id === this.floatId
    );
    this.characterId = float?.args?.characterId ?? CHARACTER_NOT_SELECTED;
    this.syncAlias();

    const { image } = this.$store.getters["alias/info"].find(
      (a) => a.id === this.aliasId
    );

    if (!image) {
      console.warn(`no image on alias: ${this.aliasId}`);
    }
    await this.reloadImage(image);
  },
  methods: {
    async onCreateAlias() {
      const characterId = this.characterId;
      console.log("DebugIndicator.onClickCreateAliasToCharacter", characterId); // @DELETEME
      const character = this.$store.getters["character/info"].find(
        (c) => c.id === characterId
      );

      const roomId = this.$store.getters["room/info"].id;
      const t = Date.now() % 1000;
      const name = `${character.name}_a${t}`;
      const position = 1;
      const a = {
        roomId,
        characterId,
        imageId: null,
        name,
        position,
      };

      await FSAlias.Create(a);
    },
    async onCharacterChange(characterId) {
      this.characterId = characterId;
      this.syncAlias();

      const { image } = this.$store.getters["alias/info"].find(
        (a) => a.id === this.aliasId
      );
      await this.reloadImage(image);
    },
    onCharacterNameInput(value) {
      console.log("CharacterEdit.onCharacterNameInput", value); // @DELETEME
      FSCharacter.Update(this.characterId, { name: value });
    },
    onCharacterTextInput(value) {
      console.log("CharacterEdit.onCharacterTextInput", value); // @DELETEME
      const washedText = washExcelNastyText(value);
      FSCharacter.Update(this.characterId, { text: washedText });
    },
    onCharacterShowOnInitiative(value) {
      console.log("CharacterEdit.onCharacterShowOnInitiative", value); // @DELETEME
      FSCharacter.Update(this.characterId, { showOnInitiative: value });
    },
    async onChangeColor(color) {
      console.log("CharacterEdit.onChangeColor", color); // @DELETEME
      this.chatColor = color;
      await FSCharacter.Update(this.characterId, { color });
    },
    async onChangePosition(e) {
      const chatPositionStr = e.currentTarget.value || "0";
      const chatPosition = parseInt(chatPositionStr, 10);
      await FSCharacter.Update(this.characterId, {
        chatPosition,
      });
      this.chatPosition = chatPositionStr;
    },
    async onChangePawnSize(pawnSizeStr) {
      console.log("CharacterEdit.onChangePawnSize", pawnSizeStr); // @DELETEME
      await FSCharacter.Update(this.characterId, {
        pawnSize: parseInt(pawnSizeStr, 10),
      });
      this.pawnSizeStr = pawnSizeStr;
    },
    async onChangeAlias(aliasId) {
      const { image } = this.$store.getters["alias/info"].find(
        (a) => a.id === aliasId
      );
      await this.reloadImage(image);
    },
    async onAliasNameChange(aliasId, name) {
      console.log("CharacterEdit.onAliasNameChange", aliasId, name); // @DELETEME
      await FSAlias.Update(aliasId, { name });
    },
    async onAliasImageChange(imageId) {
      console.log("CharacterEdit.onAliasImageChange", imageId); // @DELETEME
      const { aliasId } = this;
      await FSAlias.SetImageId(aliasId, imageId);

      await this.reloadImage(imageId);
    },
    async reloadImage(imageId) {
      const image = await FSImage.GetById({ id: imageId });
      this.srcUrl = image ? image.url : "";
      this.imgAlt = image ? "" : "画像未設定";
      this.imageId = imageId;
    },
    syncAlias() {
      console.log("CharacterEdit.syncAlias"); // @DELETEME
      const {
        activeAlias = null,
        chatPosition = 0,
        pawnSize = 1,
        color = SYSTEM_COLOR,
      } = this.$store.getters["character/info"].find(
        (c) => c.id === this.characterId
      );
      this.aliasId = activeAlias;
      this.chatPosition = `${chatPosition}`;
      this.pawnSizeStr = `${pawnSize}`;
      this.chatColor = color;
    },
    async onDeleteCharacter() {
      const characterId = this.characterId;
      await Smoke.on();
      await FSCharacter.Delete(characterId);
      await this.$store.dispatch("float/close", { id: this.floatId });
      await Smoke.off();
    },
    async onDeleteAlias(aliasId) {
      await Smoke.on();
      await FSAlias.Delete(aliasId);
      /* 削除したaliasを使用していたcharacterに別のaliasが付くので再取得 */
      const { activeAlias = null } = this.$store.getters["character/info"].find(
        (c) => c.id === this.characterId
      );
      this.aliasId = activeAlias;
      await Smoke.off();
    },
  },
  computed: {
    characterItemList() {
      return this.$store.getters["character/info"].map((c) => ({
        text: c.name,
        value: c.id,
      }));
    },
    character() {
      return (
        this.$store.getters["character/info"].find(
          (c) => c.id === this.characterId
        ) || {}
      );
    },
    aliases() {
      return this.$store.getters["alias/info"].filter(
        (a) => a.character === this.characterId
      );
    },
    aliasItems() {
      return this.$store.getters["alias/info"]
        .filter((a) => a.character === this.characterId)
        .map((a) => ({
          value: a.id,
          text: a.name,
        }));
    },
    pawnSizeItems() {
      const size = Array(10)
        .fill(0)
        .map((_, i) => i + 1);
      return size.map((i) => ({ value: `${i}`, text: `x${i}` }));
    },
    showOnInitiative() {
      return !!this.character.showOnInitiative;
    },
    myCharacter() {
      const owner = this.character?.owner;
      const myUserId = this.$store.getters["auth/user"].id;
      return owner === myUserId;
    },
  },
};
</script>
