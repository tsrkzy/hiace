<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    {{ playing ? "PLAYING!" : "" }}
    <label
      ><span>mute</span><input @input="onInputMute" type="checkbox"
    /></label>
    <label v-if="loaded"
      ><span>loop</span
      ><input @input="onInputLoop" :checked="sound.loop" type="checkbox"
    /></label>
    <label>
      <span>volume: </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value="0.5"
        @change="onInputVolume"
      />
    </label>
    {{ soundId }}
    <ha-button v-if="sound" :disabled="!loaded" @click="onClickPlay"
      >PLAY</ha-button
    >
    <ha-button v-if="sound" @click="onClickBroadcast">BROADCAST</ha-button>
    <ha-button v-if="sound" @click="onClickDelete"
      >DELETE: {{ this.soundId }}</ha-button
    >
    <audio
      :id="`audio_sound_${soundId}`"
      :loop="sound && sound.loop"
      preload="auto"
    >
      <source :src="url" />
    </audio>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
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
    const $a = audioEl(this.soundId);
    $a.volume = 0.1;

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
    const sound = await FSSound.GetById({ id: this.soundId });
    this.url = sound.url;

    $a.load();
  },
  data() {
    return {
      /* srcから<audio>が音声ファイルのロードを正常に完了し、再生準備が整ったらtrue */
      loaded: false,

      /* 再生中はtrue、loopせず止まったりpauseした場合はfalse */
      playing: false,

      url: null
    };
  },
  computed: {
    sound() {
      return this.$store.getters["sound/info"].find(s => s.id === this.soundId);
    },
    roomMusic() {
      return this.$store.getters["room/music"];
    },
    room() {
      return this.$store.getters["room/info"];
    }
  },
  methods: {
    async onClickBroadcast() {
      await FSRoom.SoundBroadcast(this.room.id, this.soundId);
    },
    async onClickDelete() {
      await FSSound.Delete(this.soundId);
    },
    async onClickPlay() {
      await this.play();
    },
    onInputVolume(e) {
      const v = e.currentTarget.value;
      const $a = audioEl(this.soundId);
      $a.volume = parseFloat(v);
    },
    onInputMute(e) {
      const $a = audioEl(this.soundId);
      $a.muted = e.currentTarget.checked;
    },
    async onInputLoop(e) {
      const loop = e.currentTarget.checked;
      await FSSound.Update(this.soundId, { loop });
    },
    async play() {
      console.log("SoundEditor.play", this.soundId); // @DELETEME
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
      await $a.play();
      this.playing = true;

      $a.onpause = () => {
        this.playing = false;
        $a.onpause = null;
      };

      $a.onended = () => {
        this.playing = false;
        $a.onended = null;
      };
    },
    pause() {
      console.log("SoundEditor.pause", this.soundId); // @DELETEME
      const $a = audioEl(this.soundId);
      if (!$a) {
        throw new Error("cannot found audio element");
      }

      /* すでに停止している場合は何もしない */
      if ($a.paused) {
        return false;
      }

      $a.pause();
    }
  },
  watch: {
    async roomMusic(music) {
      if (this.soundId === music) {
        await this.play();
      } else if (this.playing) {
        this.pause();
      }
    }
  }
};
</script>

<style scoped></style>
