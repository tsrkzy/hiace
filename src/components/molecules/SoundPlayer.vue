<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <fieldset :class="{ playing }">
    <legend>{{ soundName }}</legend>
    <div>
      <ha-checkbox label="消音" @input="onInputMute"></ha-checkbox>
      <ha-checkbox
        label="繰返"
        @input="onInputLoop"
        :value="sound.loop"
      ></ha-checkbox>
      <ha-button v-if="testPlayBtn" @click="onPlay">試聴開始</ha-button>
      <ha-button v-if="testPauseBtn" @click="onPause">試聴停止</ha-button>
      <ha-button v-if="playBtn" @click="onBroadcast">再生</ha-button>
      <ha-button v-if="pauseBtn" @click="onStopBroadcast">停止</ha-button>
      <ha-button v-if="sound" @click="onDelete">削除</ha-button>
    </div>
    <div>
      <label>
        <span>音量: </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value="0.1"
          @change="onInputVolume"
        />
      </label>
    </div>
  </fieldset>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSSound } from "@/collections/Sound";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import { Sound } from "@/scripts/Sound";
import { touch } from "@/scripts/touch";
import store from "@/store";

export default {
  name: "SoundEditor",
  components: { HaCheckbox, HaButton },
  props: {
    soundId: { type: String, require: true }
  },
  async created() {
    const $a = new Sound(this.soundId);
    $a.volume = 0.1;

    const { url } = FSSound.GetById({ id: this.soundId });
    await $a.load(url);
    if (this.roomMusic === this.soundId) {
      await $a.play();
    }
  },
  data() {
    return {
      /* srcから<audio>が音声ファイルのロードを正常に完了し、再生準備が整ったらtrue */
      loaded: false,

      testPlay: false,

      url: null
    };
  },
  computed: {
    sound() {
      return this.$store.getters["sound/info"].find(s => s.id === this.soundId);
    },
    soundName() {
      return this.sound?.name;
    },
    loop() {
      return this.sound?.loop;
    },
    roomMusic() {
      return this.$store.getters["room/music"];
    },
    room() {
      return this.$store.getters["room/info"];
    },
    playing() {
      return this.$store.getters["sound/playing"] === this.soundId;
    },
    /* グローバル再生中は非表示 */
    /* ローカル再生中は切り替え */
    testPlayBtn() {
      return this.roomMusic !== this.soundId && !this.testPlay;
    },
    testPauseBtn() {
      return this.roomMusic !== this.soundId && this.testPlay;
    },
    /* ローカル再生中は非表示 */
    /* グローバル再生中は切り替え */
    playBtn() {
      return this.roomMusic !== this.soundId && !this.testPlay;
    },
    pauseBtn() {
      return this.roomMusic === this.soundId && !this.testPlay;
    }
  },
  methods: {
    async onBroadcast() {
      this.pause(true);
      this.testPlay = false;
      await FSRoom.SoundBroadcast(this.room.id, this.soundId);
      touch("音源", "sound", this.soundId);
    },
    async onStopBroadcast() {
      await FSRoom.SoundStop(this.room.id);
      touch("音源", "sound", this.soundId);
    },
    async onDelete() {
      await FSSound.Delete(this.soundId);
    },
    async onPlay() {
      await this.play(true);
      this.testPlay = true;
    },
    async onPause() {
      this.pause(true);
      this.testPlay = false;
    },
    onInputVolume(e) {
      const v = e.currentTarget.value;
      const $a = Sound.GetById(this.soundId);
      $a.volume = parseFloat(v);
    },
    onInputMute(checked) {
      const $a = Sound.GetById(this.soundId);
      $a.muted = checked;
    },
    async onInputLoop(loop) {
      await FSSound.Update(this.soundId, { loop });
    },
    async play(testPlay = false) {
      console.log("SoundEditor.play", this.soundId);
      const $a = Sound.GetById(this.soundId);
      await $a.play(testPlay);
    },
    pause() {
      console.log("SoundEditor.pause", this.soundId); // @DELETEME
      const $a = Sound.GetById(this.soundId);
      this.testPlay = false;
      $a.pause();
    }
  },
  watch: {
    loop(loop) {
      const $a = Sound.GetById(this.soundId);
      $a.loop = loop;
    },
    roomMusic(music) {
      console.log("SoundEditor.roomMusic");
      if (this.soundId === music) {
        this.pause();
        this.play();
        this.$store.dispatch("sound/setPlaying", { playing: this.soundId });
        return;
      }
      this.pause();
      if (!music) {
        store.dispatch("sound/unsetPlaying");
      }
    }
  }
};
</script>

<style scoped>
fieldset.playing {
  animation: 2s linear 0s infinite alternate blink;
}
@keyframes blink {
  from {
    background-color: white;
  }
  to {
    background-color: lightpink;
  }
}
</style>
