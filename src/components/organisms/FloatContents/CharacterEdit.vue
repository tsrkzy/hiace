<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div>
      {{ characterId }}
    </div>
    <div>
      <ha-input-form
        label="character.name = "
        :value="character['name']"
        @change="onCharacterNameInput"
      ></ha-input-form>
    </div>
    <div>
      <ha-textarea
        label="character.text = "
        rows="3"
        :value="character['text']"
        @change="onCharacterTextInput"
      ></ha-textarea>
    </div>
    <div>
      <ha-checkbox
        label="show on initiative"
        v-model="showOnInitiative"
        @change="onCharacterShowOnInitiative"
      ></ha-checkbox>
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
      <ha-select :items="aliasItems" v-model="aliasId" @change="onChangeAlias">
        <option disabled :value="null">select alias</option>
      </ha-select>

      <img
        :src="srcUrl"
        alt="character.activeAlias.image"
        style="max-width: 128px;max-height: 128px;"
      />
      <details
        ><summary>choose image</summary>
        <div style="width: 100%;max-height:192px;overflow-y: scroll;">
          <image-show-case
            v-model="imageId"
            @selectImage="onAliasImageChange"
          ></image-show-case>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { FSImage } from "@/collections/Image";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import ImageShowCase from "@/components/molecules/ImageShowCase";

const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export default {
  name: "CharacterEdit",
  components: { HaCheckbox, HaSelect, ImageShowCase, HaTextarea, HaInputForm },
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
      pawnSizeStr: "1",
      showOnInitiative: false
    };
  },
  async created() {
    const float = this.$store.getters["float/info"].find(
      f => f.id === this.floatId
    );
    this.characterId = float?.args?.characterId ?? CHARACTER_NOT_SELECTED;

    const {
      activeAlias,
      pawnSize = 1,
      showOnInitiative = false
    } = this.$store.getters["character/info"].find(
      c => c.id === this.characterId
    );
    this.aliasId = activeAlias;
    this.pawnSizeStr = `${pawnSize}`;
    this.showOnInitiative = showOnInitiative;

    const { image } = this.$store.getters["alias/info"].find(
      a => a.id === activeAlias
    );

    if (!image) {
      console.warn(`no image on alias: ${activeAlias}`);
      return false;
    }
    const { url } = await FSImage.GetById({ id: image });
    this.srcUrl = url;
  },
  methods: {
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
      const { url } = await FSImage.GetById({ id: image });
      this.srcUrl = url;
    },
    async onAliasImageChange(imageId) {
      console.log("CharacterEdit.onAliasImageChange", imageId); // @DELETEME
      const { aliasId } = this;
      await FSAlias.SetImageId(aliasId, imageId);

      const { url } = await FSImage.GetById({ id: imageId });
      this.srcUrl = url;
    }
  },
  computed: {
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

<style scoped></style>
