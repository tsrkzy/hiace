<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    {{ playing }}
    <label><span>mute</span><input v-model="muted" type="checkbox"/></label>
    <label v-if="loaded"
      ><span>loop</span><input :value="sound.loop" type="checkbox"
    /></label>
    <label v-if="loaded"><span>hook</span><input type="checkbox"/></label>
    <ha-button v-if="sound" :disabled="!loaded" @click="onClickPlay"
      >play</ha-button
    >
    <audio
      :id="`audio_sound_${soundId}`"
      :loop="sound && sound.loop"
      :muted="muted"
      preload="auto"
    >
      <source :src="url" />
    </audio>
  </div>
</template>

<script>
import { FSSound } from "@/collections/Sound";
import HaButton from "@/components/atoms/HaButton";

/**
 * @return {HTMLAudioElement | null}
 * */
const audioEl = soundId => {
  const $a = document.getElementById(`audio_sound_${soundId}`);
  return $a instanceof HTMLAudioElement ? $a : null;
};

export default {
  name: "SoundEditor",
  components: { HaButton },
  props: {
    soundId: { type: String, require: true }
  },
  async mounted() {
    const sound = await FSSound.GetById({ id: this.soundId });

    if (!sound) {
      throw new Error(`failed to fetch sound: ${this.soundId}`);
    }

    this.sound = sound;
    const $a = audioEl(this.soundId);

    $a.oncanplaythrough = () => {
      /* 読み込みし、再生準備完了 */
      this.loaded = true;
      $a.oncanplaythrough = null;
      console.log(`sound ready for play: ${this.soundId}`);
    };

    $a.onerror = e => {
      console.error(e);
      throw new Error(`failed to load sound: ${this.soundId}`);
    };

    /* srcを設定した後、明示的にloadする */
    this.url = this.sound.url;
    $a.load();
  },
  data() {
    return {
      sound: null,

      /* srcから<audio>が音声ファイルのロードを正常に完了し、再生準備が整ったらtrue */
      loaded: false,

      /* 再生中はtrue、loopせず止まったりpauseした場合はfalse */
      playing: false,

      url: null,

      muted: false
    };
  },
  methods: {
    onClickPlay() {
      const $a = audioEl(this.soundId);
      if (!$a) {
        throw new Error("cannot found audio element");
      }

      /* すでに再生中の場合、再生位置を先頭へ移動して終了 */
      if (!$a.paused) {
        $a.currentTime = 0;
        return false;
      }

      /* 再生開始 */
      $a.play();
      this.playing = true;

      $a.onpause = () => {
        this.playing = false;
        $a.onpause = null;
      };

      $a.onended = () => {
        this.playing = false;
        $a.onended = null;
      };
    }
  }
};
</script>

<style scoped></style>
