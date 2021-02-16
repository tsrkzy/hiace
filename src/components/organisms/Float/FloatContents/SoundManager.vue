<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <input
      type="file"
      multiple
      accept="audio/*"
      :value="inputFiles"
      @change="onClickFileUploadHandler"
    />
    <hr />
    <sound-editor :key="s.id" v-for="s in sounds" :sound-id="s.id">
    </sound-editor>
  </div>
</template>

<script>
import { FSSound } from "@/collections/Sound";
import SoundEditor from "@/components/molecules/SoundPlayer";
export default {
  name: "SoundManager",
  components: { SoundEditor },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      inputFiles: null
    };
  },
  methods: {
    async onClickFileUploadHandler(e) {
      const { files = [] } = e.currentTarget;

      const promiseList = [];
      files.forEach(f => {
        promiseList.push(FSSound.Create(f));
      });
      await Promise.all(promiseList);

      /* アップロードに成功したら空にする */
      this.inputFiles = null;
    }
  },
  computed: {
    sounds() {
      return this.$store.getters["sound/info"];
    }
  }
};
</script>

<style scoped></style>
