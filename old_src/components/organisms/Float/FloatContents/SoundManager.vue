<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <input
      type="file"
      multiple
      accept="audio/*"
      :value="inputFiles"
      @change="onClickFileUploadHandler"
    />
    <hr />
    <div>
      <volume-slider />
    </div>
    <div>
      <ha-checkbox v-model="deleteMode" label="音源を削除する"></ha-checkbox>
    </div>
    <sound-editor
      :key="s.id"
      v-for="s in sounds"
      :sound-id="s.id"
      :deletable="deleteMode"
    >
    </sound-editor>
  </div>
</template>

<script>
import { FSSound } from "@/collections/Sound";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import SoundEditor from "@/components/molecules/SoundPlayer";
import VolumeSlider from "@/components/organisms/Float/FloatContents/VolumeSlider";

export default {
  name: "SoundManager",
  components: { HaCheckbox, VolumeSlider, SoundEditor },
  props: {
    floatId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      deleteMode: false,
      inputFiles: null,
    };
  },
  methods: {
    async onClickFileUploadHandler(e) {
      const { files = [] } = e.currentTarget;

      const promiseList = [];
      Array.prototype.forEach.call(files, (f) => {
        promiseList.push(FSSound.Create(f));
      });
      await Promise.all(promiseList);

      /* アップロードに成功したら空にする */
      this.inputFiles = null;
    },
  },
  computed: {
    sounds() {
      return this.$store.getters["sound/info"];
    },
  },
};
</script>
