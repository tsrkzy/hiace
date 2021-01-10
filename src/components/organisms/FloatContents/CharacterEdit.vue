<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-select
      :value="characterId"
      :items="characterItemList"
      mandatory
      @change="onCharacterChange"
    ></ha-select>
    <div>
      <ha-input-form
        label="名前"
        :value="character['name']"
        @change="onCharacterNameInput"
      ></ha-input-form>
    </div>
    <div>
      <ha-textarea
        rows="3"
        :value="character['text']"
        @change="onCharacterTextInput"
      ></ha-textarea>
    </div>
    <div>
      <ha-checkbox
        label="データテーブルに表示"
        v-model="showOnInitiative"
        @change="onCharacterShowOnInitiative"
      ></ha-checkbox>
    </div>
    <div>
      <color-picker :chat-color="chatColor" @change="onChangeColor" />
    </div>
    <div>
      <ha-select
        :items="pawnSizeItems"
        v-model="pawnSizeStr"
        @change="onChangePawnSize"
      >
        <option disabled :value="null">select pawn size</option>
      </ha-select>
    </div>
    <div>
      <ha-select
        v-model="aliasId"
        :items="aliasItems"
        mandatory
        @change="onChangeAlias"
      >
      </ha-select>
      <ul>
        <li v-for="a in aliases" :key="a.id">
          <ha-input-form
            :value="a.name"
            @change="onAliasNameChange(a.id, $event)"
          ></ha-input-form>
        </li>
      </ul>
      <img
        :src="srcUrl"
        :alt="imgAlt"
        style="max-width: 128px;max-height: 128px;"
      />
      <scroll-summary>
        <image-show-case
          v-model="imageId"
          @selectImage="onAliasImageChange"
        ></image-show-case>
      </scroll-summary>
    </div>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { SYSTEM_COLOR } from "@/collections/Chat";
import { FSImage } from "@/collections/Image";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import ImageShowCase from "@/components/molecules/ImageShowCase";
import ColorPicker from "@/components/organisms/FloatContents/ColorPicker";
import ScrollSummary from "@/components/organisms/ScrollSummary";

const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export default {
  name: "CharacterEdit",
  components: {
    ColorPicker,
    ScrollSummary,
    HaCheckbox,
    HaSelect,
    ImageShowCase,
    HaTextarea,
    HaInputForm
  },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      characterId: null,
      imageId: null,
      aliasId: null,
      srcUrl: null,
      imgAlt: null,
      pawnSizeStr: "1",
      showOnInitiative: false,
      chatColor: SYSTEM_COLOR
    };
  },
  async created() {
    const float = this.$store.getters["float/info"].find(
      f => f.id === this.floatId
    );
    this.characterId = float?.args?.characterId ?? CHARACTER_NOT_SELECTED;
    this.syncAlias();

    const { image } = this.$store.getters["alias/info"].find(
      a => a.id === this.aliasId
    );

    if (!image) {
      console.warn(`no image on alias: ${this.aliasId}`);
    }
    await this.reloadImage(image);
  },
  methods: {
    async onCharacterChange(characterId) {
      this.characterId = characterId;
      this.syncAlias();

      const { image } = this.$store.getters["alias/info"].find(
        a => a.id === this.aliasId
      );
      await this.reloadImage(image);
    },
    onCharacterNameInput(value) {
      console.log("CharacterEdit.onCharacterNameInput", value); // @DELETEME
      FSCharacter.Update(this.characterId, { name: value });
    },
    onCharacterTextInput(value) {
      console.log("CharacterEdit.onCharacterTextInput", value); // @DELETEME
      FSCharacter.Update(this.characterId, { text: value });
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
    onChangePawnSize(pawnSizeStr) {
      console.log("CharacterEdit.onChangePawnSize", pawnSizeStr); // @DELETEME
      FSCharacter.Update(this.characterId, {
        pawnSize: parseInt(pawnSizeStr, 10)
      });
    },
    async onChangeAlias(aliasId) {
      const { image } = this.$store.getters["alias/info"].find(
        a => a.id === aliasId
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
        pawnSize = 1,
        showOnInitiative = false,
        color = SYSTEM_COLOR
      } = this.$store.getters["character/info"].find(
        c => c.id === this.characterId
      );
      this.aliasId = activeAlias;
      this.pawnSizeStr = `${pawnSize}`;
      this.showOnInitiative = showOnInitiative;
      this.chatColor = color;
    }
  },
  computed: {
    characterItemList() {
      return this.$store.getters["character/info"].map(c => ({
        text: c.name,
        value: c.id
      }));
    },
    character() {
      return (
        this.$store.getters["character/info"].find(
          c => c.id === this.characterId
        ) || {}
      );
    },
    aliases() {
      return (
        this.$store.getters["alias/info"].filter(
          a => a.character === this.characterId
        ) || {}
      );
    },
    aliasItems() {
      return this.$store.getters["alias/info"]
        .filter(a => a.character === this.characterId)
        .map(a => ({
          value: a.id,
          text: a.name
        }));
    },
    pawnSizeItems() {
      const size = Array(10)
        .fill(0)
        .map((_, i) => i + 1);
      return size.map(i => ({ value: `${i}`, text: `x${i}` }));
    }
  }
};
</script>
