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
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import ImageShowCase from "@/components/molecules/ImageShowCase";

const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export default {
  name: "CharacterEdit",
  components: { HaSelect, ImageShowCase, HaTextarea, HaInputForm },
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
      srcUrl: null
    };
  },
  async created() {
    const float = this.$store.getters["float/info"].find(
      f => f.id === this.floatId
    );
    this.characterId = float?.args?.characterId ?? CHARACTER_NOT_SELECTED;

    const { activeAlias } = this.$store.getters["character/info"].find(
      c => c.id === this.characterId
    );
    this.aliasId = activeAlias;

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
      FSCharacter.Update(this.characterId, { name: value });
    },
    onCharacterTextInput(value) {
      FSCharacter.Update(this.characterId, { text: value });
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
      return this.$store.getters["character/info"].find(
        c => c.id === this.characterId
      );
    },
    aliases() {
      return this.$store.getters["alias/info"].filter(
        a => a.character === this.characterId
      );
    },
    aliasItems() {
      return this.$store.getters["alias/info"]
        .filter(a => a.character === this.characterId)
        .map(a => ({
          value: a.id,
          text: a.name
        }));
    }
  }
};
</script>

<style scoped></style>
