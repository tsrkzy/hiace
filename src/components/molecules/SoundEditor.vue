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
        v-if="loaded"
        label="繰返"
        @input="onInputLoop"
        :value="sound.loop"
      ></ha-checkbox>
      <ha-button
        v-if="sound && !playing"
        :disabled="!loaded"
        @click="onClickPlay"
        >試聴開始</ha-button
      >
      <ha-button
        v-if="sound && playing"
        :disabled="!loaded"
        @click="onClickPause"
        >試聴停止</ha-button
      >
      <ha-button v-if="sound && !playing" @click="onClickBroadcast"
        >ルームで再生</ha-button
      >
      <ha-button v-if="sound && playing" @click="onClickStopBroadcast"
        >ルームで停止</ha-button
      >
      <ha-button v-if="sound && false" @click="onClickDelete">削除</ha-button>
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
      <audio
        :id="`audio_sound_${soundId}`"
        :loop="sound && sound.loop"
        preload="auto"
      >
        <source :src="url" />
      </audio>
    </div>
  </fieldset>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSSound } from "@/collections/Sound";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";

/**
 * @return {HTMLAudioElement | null}
 * */
const audioEl = soundId => {
  const $a = document.getElementById(`audio_sound_${soundId}`);
  return $a instanceof HTMLAudioElement ? $a : null;
};

export default {
  name: "SoundEditor",
  components: { HaCheckbox, HaButton },
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

      /* 接続時に既に再生中なら再生する */
      if (this.roomMusic === this.sound?.id) {
        this.play();
      }
    };

    $a.onerror = e => {
      console.error(e);
      throw new Error(`failed to load sound: ${this.soundId}`);
    };

    /* srcを設定した後、明示的にloadする */
    const sound = await FSSound.GetById({ id: this.soundId });
    console.log(sound.url, sound); // @DELETEME
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
    soundName() {
      return this.sound?.name;
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
    async onClickStopBroadcast() {
      await FSRoom.SoundStop(this.room.id);
    },
    async onClickDelete() {
      await FSSound.Delete(this.soundId);
    },
    async onClickPlay() {
      await this.play();
    },
    async onClickPause() {
      await this.pause();
    },
    onInputVolume(e) {
      const v = e.currentTarget.value;
      const $a = audioEl(this.soundId);
      $a.volume = parseFloat(v);
    },
    onInputMute(checked) {
      const $a = audioEl(this.soundId);
      $a.muted = checked;
    },
    async onInputLoop(loop) {
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

      /* 再生停止、再生位置を先頭にリセット */
      $a.pause();
      $a.currentTime = 0;
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
